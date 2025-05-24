import threading
from flask import Flask
import json
from flask_sock import Sock
from flask_cors import CORS
from vnindex.routes import vnindex
from details.routes import details
from stock_price_api.stream import messages, get_data_stream

app = Flask(__name__)
app.register_blueprint(vnindex, url_prefix="/vnindex")
app.register_blueprint(details, url_prefix="/details")
sock = Sock(app)
CORS(app)

@sock.route('/data')
def echo(ws):
    while True:
        data = ws.receive()
        if data == "receive-data":
            ws.send(json.dumps(messages))


if __name__ == "__main__":
    market_thread = threading.Thread(target=get_data_stream, daemon=True)
    market_thread.start()
    # md_get_daily_index()
    app.run(debug=True)
	
