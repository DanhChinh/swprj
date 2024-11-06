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
        data_class.addDt(data)
        for model in model_list:
            model.checkResult(data[-1])
        print("________________")
    else:
        data_class.split()
        max_percent = 0
        prd = None
        for model in model_list:
            model.makePrd(data_class.x_train, data_class.y_train, data)
            print(model.persent, model.prd, model.name)
            max_percent = max(model.persent, max_percent)
            if model.persent == max_percent:
                prd = model.prd

        emit('response', json.dumps({"content": prd}))
        pass

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # emit('response', {'data': 'Welcome!'})

@socketio.on('disconnect')
def handle_disconnect():
    saveFile("./data/prd/prd.txt", DecisionTree.npdata)
    # saveFile(f"./data/trend/{getTextTime()}.txt", server_data.trend)
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
