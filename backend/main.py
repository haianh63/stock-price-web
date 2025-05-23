import threading
import config
import json
from ssi_fc_data.fc_md_stream import MarketDataStream
from ssi_fc_data.fc_md_client import MarketDataClient
from ssi_fc_data import model
from flask import Flask, jsonify, request
from flask_sock import Sock
import datetime
from utils import get_n_nearest_workdays, ratioChange
from flask_cors import CORS

# client = MarketDataClient(config)
# def md_get_daily_index():
# 	print(client.daily_index(config, model.daily_index( '123', 'VNINDEX', '16/05/2025', '16/05/2025', 1, 100, '', '')))

app = Flask(__name__)
sock = Sock(app)
CORS(app)

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

client = MarketDataClient(config)
def md_get_intraday_OHLC(symbol, fromDate, toDate):
    result = client.intraday_ohlc(config, model.intraday_ohlc(symbol, fromDate, toDate, 1, 1000, True, 1))
    return result
    
def convertTradingTimeTotimestamp(tradingDate, time):
    day, month, year = tradingDate.split("/")
    hour, minute, second = time.split(":")
    dt = datetime.datetime(int(year), int(month), int(day), int(hour), int(minute), int(second))
    return dt.timestamp()

def convertTradingTimeToString(tradingDate, time):
    day, month, year = tradingDate.split("/")
    hour, minute, second = time.split(":")
    return f"{year}-{month}-{day} {hour}:{minute}:{second}"

def md_get_stock_price(symbol, market, fromDate, toDate):
	return client.daily_stock_price(config, model.daily_stock_price (symbol, fromDate, toDate, 1, 10, market))

def md_get_securities_details(symbol, market):
    req = model.securities_details(market, symbol, 1, 100)
    return client.securities_details(config, req)

def md_get_daily_index(fromDate, toDate):
    return client.daily_index(config, model.daily_index( '100', 'VNINDEX', fromDate, toDate, 1, 100, '', ''))

@app.route("/vnindex")
def getVNIndex():
    today = get_n_nearest_workdays()[0]
    data = md_get_intraday_OHLC('VNINDEX', today, today)["data"]
    # ratioChange = md_get_daily_index(today, today)["data"][0]["RatioChange"]
    parsed_data = [[convertTradingTimeToString(item["TradingDate"], item["Time"]), item["Value"]] for item in data]
    response = jsonify(parsed_data)
    return response
      
# @app.route("/data")
# def send_data():
# 	return jsonify(messages)

@sock.route('/data')
def echo(ws):
    while True:
        data = ws.receive()
        if data == "receive-data":
            ws.send(json.dumps(messages))

@app.route("/details", methods=['POST'])
def getStockDetails():
    data = request.json
    symbol = data.get("symbol")
    market = data.get("market")
    date = get_n_nearest_workdays()[0]

    response = md_get_stock_price(symbol, market, date, date)["data"]
    data = list(filter(lambda item: symbol.lower() == item["Symbol"].lower(), response))
    print(data)
    company_response = md_get_securities_details(symbol, market)["data"]

    parsedData = {
        "Symbol": data[0]["Symbol"],
        "CurrentPrice": data[0]["ClosePrice"],
        "OpenPrice": data[0]["OpenPrice"],
        "HighestPrice": data[0]["HighestPrice"],
        "LowestPrice": data[0]["LowestPrice"],
        "CompanyName": company_response[0]["RepeatedInfo"][0]["SymbolName"],
        "EngCompanyName": company_response[0]["RepeatedInfo"][0]["SymbolEngName"],
        "CeilingPrice": data[0]["CeilingPrice"],
        "FloorPrice": data[0]["FloorPrice"],
        "RefPrice": data[0]["RefPrice"]
    }
    return jsonify(parsedData)

@app.route("/details/intraday", methods=['POST'])
def getIntradayStockPrice():
    data = request.json
    symbol = data.get("symbol")

    today = get_n_nearest_workdays()[0]
    data = md_get_intraday_OHLC(symbol, today, today)["data"]

    return jsonify(data)
    
@app.route("/vnindex/change")
def getVNIndexChange():
    dates = get_n_nearest_workdays(n=30)
    start = dates[len(dates) - 1]
    end = dates[0]
    daily_index = md_get_daily_index(start, end)["data"]
    ratioChanges = {
         '1-day':  float(daily_index[0]["RatioChange"]),
         '1-week': ratioChange(float(daily_index[6]["IndexValue"]), float(daily_index[0]["IndexValue"])),
         '1-month': ratioChange(float(daily_index[len(daily_index) - 1]["IndexValue"]), float(daily_index[0]["IndexValue"]))
    }

    return jsonify(ratioChanges)



if __name__ == "__main__":
    market_thread = threading.Thread(target=get_data_stream, daemon=True)
    market_thread.start()
    # md_get_daily_index()
    app.run(debug=True)
	
