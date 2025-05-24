import stock_price_api.config as config
import json
from ssi_fc_data.fc_md_stream import MarketDataStream
from ssi_fc_data.fc_md_client import MarketDataClient

messages = []
def get_market_data(message):
	parsedMessage = {
		"DataType": message["DataType"],
		"Content": json.loads(message["Content"])
	}
	messages.append(parsedMessage)
	# print(parsedMessage)

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
			