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

    if obj["header"] == "trend":
        # server_data.trend = data
        pass
    elif obj["header"] == "prd":
        if len(data) == 274:
            DecisionTree.addDt(data)
        else:
            print("pass data", len(data))
    else:
        prd = DecisionTree.makePrd(data)
        emit('response', json.dumps({"content": prd}))

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # emit('response', {'data': 'Welcome!'})

@socketio.on('disconnect')
def handle_disconnect():
    saveFile("./data/prd/prd.txt", DecisionTree.data)
    # saveFile(f"./data/trend/{getTextTime()}.txt", server_data.trend)
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
