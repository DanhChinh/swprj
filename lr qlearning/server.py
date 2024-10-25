from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
from qgame import *

app = Flask(__name__)
CORS(app)  # Bật CORS cho toàn bộ ứng dụng
socketio = SocketIO(app, cors_allowed_origins="*")  # Cho phép tất cả nguồn

@socketio.on('message')
def handle_message(msg):
    print(msg)
    obj = json.loads(msg)
    #obj {sid, state, eid, b, RESULT(new), reward,isClicked}
    #update reward
    if obj["eid"] == obj["result"]:
        obj["reward"] = obj["b"]
    else:
        obj["reward"] = -obj["b"]
    #obj {sid, state, eid, b, RESULT(new), REWARD(new),isClicked}
    state = obj["state"]
    prediction = obj["eid"]
    bet = obj["b"]
    action = f"{prediction}_{bet}"
    actual_result = obj["result"]
    reward = obj["reward"]
    next_state = update_state(state ,actual_result)
    update_q_table(state, action, reward, next_state)

    action = choose_action(next_state)
    obj["eid"], obj["b"] = map(int, action.split('_'))
    obj["state"] = next_state
    emit('response', json.dumps(obj))
    save_to_json_file(q_table)

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    # emit('response', {'data': 'Welcome!'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
