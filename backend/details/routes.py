from flask import Blueprint, request, jsonify
from utils.utils import get_n_nearest_workdays
from stock_price_api.req_res import md_get_stock_price, md_get_securities_details, md_get_intraday_OHLC

details = Blueprint('details', __name__)

@details.route("", methods=['POST'])
def getStockDetails():
    data = request.json
    symbol = data.get("symbol")
    market = data.get("market")
    date = get_n_nearest_workdays()[0]

    response = md_get_stock_price(symbol, market, date, date)["data"]
    data = list(filter(lambda item: symbol.lower() == item["Symbol"].lower(), response))
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

@details.route("/intraday", methods=['POST'])
def getIntradayStockPrice():
    data = request.json
    symbol = data.get("symbol")

    today = get_n_nearest_workdays()[0]
    data = md_get_intraday_OHLC(symbol, today, today)["data"]

    return jsonify(data)