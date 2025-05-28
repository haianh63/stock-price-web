import stock_price_api.config as config
import json
from ssi_fc_data.fc_md_stream import MarketDataStream
from ssi_fc_data.fc_md_client import MarketDataClient
from stock_price_api.redis_config import REDIS_HOST, REDIS_PORT
import redis

redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

def get_market_data(message):
	parsedMessage = {
		"DataType": message["DataType"],
		"Content": json.loads(message["Content"])
	}
	# messages.append(parsedMessage)
	symbol = parsedMessage["Content"]["Symbol"]
	serialized_message = json.dumps(parsedMessage)
	redis_client.hset(f"stock:{symbol}", key="data", value=serialized_message)
	redis_client.publish(f"stock:{symbol}:updates", serialized_message)

def getError(error):
	print(error)
	
def get_data_stream():
	selected_channel = "X-TRADE:ALL"
	mm = MarketDataStream(config, MarketDataClient(config))
	mm.start(get_market_data, getError, selected_channel)
	message = None
	while message != "exit()":
		message = input(">> ")
		if message is not None and message != "" and message != "exit()":
			mm.swith_channel(message)
			