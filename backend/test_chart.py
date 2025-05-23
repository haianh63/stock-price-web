# import ssi_fc_trading
from ssi_fc_data import fc_md_client , model
import config
import json
from utils import get_n_nearest_workdays

client = fc_md_client.MarketDataClient(config)
def md_get_securities_details():
    req = model.securities_details('hose', 'fpt', 1, 100)
    print(client.securities_details(config, req))

def md_get_stock_price():
    result = client.daily_stock_price(config, model.daily_stock_price ('vcb', '20/05/2025', '20/05/2025', 1, 100, 'hose'))
    json_result = json.dumps(result, indent=4)
    with open("stock-price.json", "w") as outfile:
        outfile.write(json_result)
     
def md_get_intraday_OHLC():
    result = client.intraday_ohlc(config, model.intraday_ohlc('FPT', '23/05/2025', '23/05/2025', 1, 1000, True, 1))
    json_result = json.dumps(result, indent=4)
    # Writing to sample.json
    with open("result.json", "w") as outfile:
        outfile.write(json_result)

def md_get_daily_index():
    dates = get_n_nearest_workdays(n=30)
    start = dates[len(dates) - 1]
    end = dates[0]
    result = client.daily_index(config, model.daily_index( '100', 'VNINDEX', start, end, 1, 100, '', ''))
    json_result = json.dumps(result, indent=4)
    # Writing to sample.json
    with open("daily-index.json", "w") as outfile:
        outfile.write(json_result)
def main():
    md_get_intraday_OHLC()
    # md_get_stock_price()
    # md_get_securities_details()
    # md_get_daily_index()
if __name__ == '__main__':
	main()