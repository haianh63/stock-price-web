from utils.utils import generate_intervals
from stock_price_api.req_res import md_get_stock_price
import json
import redis
from stock_price_api.redis_config import REDIS_HOST, REDIS_PORT
from flask import Blueprint, request, jsonify
from tensorflow.keras.layers import Layer
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras import backend as K
import tensorflow as tf
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
predictions = Blueprint('predictions', __name__)
import time

@tf.keras.utils.register_keras_serializable()
class Attention(Layer):
    def __init__(self, **kwargs):
        super(Attention, self).__init__(**kwargs)
    
    def build(self, input_shape):
        self.W = self.add_weight(name='attention_weight', shape=(input_shape[-1], 1), initializer='random_normal', trainable=True)
        self.b = self.add_weight(name='attention_bias', shape=(input_shape[1], 1), initializer='zeros', trainable=True)
        super(Attention, self).build(input_shape)
    
    def call(self, x):
        e = K.tanh(K.dot(x, self.W) + self.b)
        e = K.squeeze(e, axis=-1)
        alpha = K.softmax(e)
        alpha = K.expand_dims(alpha, axis=-1)
        context = x * alpha
        context = K.sum(context, axis=1)
        return context


def convert_to_datetime(n):
    n = str(n)
    return n[0:4] + "-" + n[4:6] + "-" + n[6:]

def predict(data, features, target, date_col, symbol, SEQ_LENGTH, FORECAST_LENGTH):
    data = data.sort_values(date_col)
    # Load the trained model
    custom_objects = {
        'Attention': Attention,
        'mse': tf.keras.losses.MeanSquaredError()
    }
    model = tf.keras.models.load_model(f"predictions/models/{symbol}_{FORECAST_LENGTH}_model.h5", custom_objects=custom_objects)    
    # Normalize the 'Close' column separately   
    close_scaler = MinMaxScaler()
    data[target] = close_scaler.fit_transform(data[[target]])
        
    # Normalize the rest of the data
    feature_scaler = MinMaxScaler()
    data[features] = feature_scaler.fit_transform(
        data[features]
    )
    recent_sequence = data.iloc[-SEQ_LENGTH:].copy()
    X_recent = np.array(recent_sequence[features])
    X_recent = np.expand_dims(X_recent, axis=0)
    predictions = model.predict(X_recent)
    predictions = close_scaler.inverse_transform(predictions)
    # print(f"{symbol} Predicted Close Prices for the Next {FORECAST_LENGTH} Trading Days:", predictions.flatten())
    return predictions.flatten()

@predictions.route("", methods=['POST'])
def getPredicts():
    data = request.json
    symbol = data.get("symbol").upper()
    market = data.get("market").upper()
    key = f"predict-{symbol}"
    interval = generate_intervals(1)[0]

    if redis_client.exists(key):
        predictions = json.loads(redis_client.get(key))
    else:
        response = md_get_stock_price(symbol, market, interval[0], interval[1])["data"]
        data = [[item['TradingDate'], float(item['OpenPrice']),
                 float(item['HighestPrice']), float(item['LowestPrice']),
                 float(item['ClosePrice']), float(item['TotalMatchVol'])] for item in response]
        data = pd.DataFrame(data, columns=['date', 'open', 'high', 'low', 'close', 'volume'])
        features = ['open', 'high', 'low', 'close', 'volume']
        target = 'close'
        date_col = 'date'
        SEQ_LENGTH = 20
        FORECAST_LENGTH = 7
        predictions = predict(data, features, target, date_col, symbol, SEQ_LENGTH, FORECAST_LENGTH).tolist()
        redis_client.set(key, json.dumps(predictions))
    return jsonify(predictions)

def predictListSymbol(symbols, markets):
    interval = generate_intervals(1)[0]
    for i in range(len(symbols)):
        symbol = symbols[i]
        market = markets[i]
        key = f"predict-{symbol}"

        if not redis_client.exists(key):
            try:
                response = md_get_stock_price(symbol, market, interval[0], interval[1])["data"]
                data = [[item['TradingDate'], float(item['OpenPrice']),
                        float(item['HighestPrice']), float(item['LowestPrice']),
                        float(item['ClosePrice']), float(item['TotalMatchVol'])] for item in response]
                data = pd.DataFrame(data, columns=['date', 'open', 'high', 'low', 'close', 'volume'])
                features = ['open', 'high', 'low', 'close', 'volume']
                target = 'close'
                date_col = 'date'
                SEQ_LENGTH = 20
                FORECAST_LENGTH = 7
                predictions = predict(data, features, target, date_col, symbol, SEQ_LENGTH, FORECAST_LENGTH).tolist()
                redis_client.set(key, json.dumps(predictions))
            except:
                print("there is an error")

        time.sleep(1)
