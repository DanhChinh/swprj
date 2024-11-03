from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
from server_handle import *
import numpy as np
app = Flask(__name__)
CORS(app)  # Bật CORS cho toàn bộ ứng dụng
socketio = SocketIO(app, cors_allowed_origins="*")  # Cho phép tất cả nguồn

server_data = Data()

@socketio.on('message')
def handle_message(msg):
    obj = json.loads(msg)
    data = obj["content"]
    if obj["header"] == "trend":
        server_data.trend = data
    else:
        if len(data) == 302:
            server_data.prd.append(data)
        else:

            print("pass data", len(data))

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # emit('response', {'data': 'Welcome!'})

@socketio.on('disconnect')
def handle_disconnect():
    saveFile("./data/prd/prd.txt", server_data.prd)
    # if len(server_data.trend)>10:
    #     print("save server_data.trend")
    saveFile(f"./data/trend/{getTextTime()}.txt", server_data.trend)
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
