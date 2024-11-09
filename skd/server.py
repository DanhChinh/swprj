from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
from server_handle import *
import numpy as np


app = Flask(__name__)
CORS(app)  # Bật CORS cho toàn bộ ứng dụng
socketio = SocketIO(app, cors_allowed_origins="*")  # Cho phép tất cả nguồn


@socketio.on('message')
def handle_message(msg):
    obj = json.loads(msg)
    data = obj["content"]
    if obj["header"] == "add_data":
        print("rs:",data[-1])
        data_class.addDt(data)
        for model in model_list:
            model.checkResult(data[-1])
        print("________________")
    else:
        data_class.split()
        max_score = -99999
        prd = None
        for model in model_list:
            model.makePrd(data_class.x_train, data_class.y_train, data)
            score_trend = model.getTrend()
            print(score_trend, model.prd, model.name)
            max_score = max(max_score, score_trend)
            if score_trend == max_score:
                prd = model.prd

        emit('response', json.dumps({"content": prd}))
        pass

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # emit('response', {'data': 'Welcome!'})

@socketio.on('disconnect')
def handle_disconnect():
    data_class.save()
    # saveFile(f"./data/trend/{getTextTime()}.txt", server_data.trend)
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
