from flask import Blueprint, jsonify
from utils.utils import get_n_nearest_workdays, convertTradingTimeToString, ratioChange
from stock_price_api.req_res import md_get_intraday_OHLC, md_get_daily_index

vnindex = Blueprint('vnindex', __name__)

@vnindex.route("/")
def getVNIndex():
    today = get_n_nearest_workdays()[0]
    data = md_get_intraday_OHLC('VNINDEX', today, today)["data"]
    # ratioChange = md_get_daily_index(today, today)["data"][0]["RatioChange"]
    parsed_data = [[convertTradingTimeToString(item["TradingDate"], item["Time"]), item["Value"]] for item in data]
    response = jsonify(parsed_data)
    return response

@vnindex.route("/change")
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