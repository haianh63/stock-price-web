import threading
from flask import Flask
import json
from flask_socketio import SocketIO
from flask_cors import CORS
from vnindex.routes import vnindex
from details.routes import details
from stock_price_api.stream import get_data_stream
from stock_price_api.redis_config import REDIS_HOST, REDIS_PORT
import redis

app = Flask(__name__)
app.register_blueprint(vnindex, url_prefix="/vnindex")
app.register_blueprint(details, url_prefix="/details")
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

def listen_data_stream():
    pubsub = redis_client.pubsub()
    pubsub.psubscribe("stock:*:updates")

    for message in pubsub.listen():
        if message['type'] == 'pmessage':
            data = json.loads(message['data'])
            socketio.emit('stock_update', data)

@socketio.on("connect")
def handle_connect():
    print("Client connected!!!")
    data = []
    keys = redis_client.keys('stock:*')
    for key in keys:
        value = redis_client.hget(key, "data")
        if value:
            decoded_value = value.decode('utf-8')
            parsed_value = json.loads(decoded_value)
            data.append(parsed_value)
    socketio.emit('connect_update', data)
if __name__ == "__main__":
    listen_market_thread = threading.Thread(target=listen_data_stream, daemon=True)
    listen_market_thread.start()

    market_thread = threading.Thread(target=get_data_stream, daemon=True)
    market_thread.start()

    # md_get_daily_index()
    socketio.run(app, debug=True)
	
