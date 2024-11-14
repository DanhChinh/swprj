from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from server_handle import *
from mongodb_connect import *
import json
import numpy as np
app = Flask(__name__)
CORS(app)  # Bật CORS cho toàn bộ ứng dụng
socketio = SocketIO(app, cors_allowed_origins="*")  # Cho phép tất cả nguồn



@socketio.on('message')
def handle_message(msg):
    obj = json.loads(msg)
    data_js = obj["content"]
    if obj["header"] == "add_data":
        INSERT_ONE(data_js)
        for model in model_list:
            model.checkResult(int(data_js['result']))
        print("________________")
    else: #obj["header"] == "for_prd"
        objlist_filter = FILTER_OBJ(data.mongoDB, data_js)
        npdata = OBJLIST_2_MATRIX(objlist_filter)
        x_train = npdata[:, :-1]
        y_train = npdata[:, -1]
        x_test = OBJ_2_ARR1D(data_js)
        max_score = -99999
        prd = None
        for model in model_list:
            model.makePrd(x_train, y_train, x_test)
            score_trend = model.getTrend()
            print(score_trend, model.prd, model.name)
            max_score = max(max_score, score_trend)
            if score_trend == max_score:
                prd = model.prd

        emit('response', json.dumps({"content": prd}))
        print("WsIO send:",json.dumps({"content": prd}))
        data.upDateMongoDB()
        pass

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
