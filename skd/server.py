from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
from server_handle import *
import numpy as np

from sklearn.tree import DecisionTreeClassifier
model = DecisionTreeClassifier()
def make_prd(data, X_test):
    X_train = data[:, :-1]
    y_train = data[:, -1]
    # print("make_prd")
    # print(X_train)
    # print(y_train)
    # print(X_test)
    model.fit(X_train, y_train)
    return int(model.predict([X_test])[0])

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
    elif obj["header"] == "prd":
        if len(data) == 274:
            server_data.prd.append(data)
        else:

            print("pass data", len(data))
    else:
        prd = make_prd(np.array(server_data.prd), np.array(data))
        print("prd", prd)
        emit('response', json.dumps({"content": prd}))

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
