from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
from server_handle import *
app = Flask(__name__)
CORS(app)  # Bật CORS cho toàn bộ ứng dụng
socketio = SocketIO(app, cors_allowed_origins="*")  # Cho phép tất cả nguồn

data = loadFile("zdata.txt")


@socketio.on('message')
def handle_message(msg):
    obj = json.loads(msg)
    print(obj)

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # emit('response', {'data': 'Welcome!'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)