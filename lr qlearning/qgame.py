import random
import numpy as np
import json
import os



# Hàm tải Q-table từ file
def read_json_file(file_path="qtable.json"):
    # Kiểm tra xem đường dẫn có tồn tại không
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)  # Đọc dữ liệu từ file JSON
                return data
            except json.JSONDecodeError:
                print("Có lỗi xảy ra khi phân tích JSON.")
                return {}
    else:
        print("Đường dẫn không tồn tại.")
        return {}

def save_to_json_file(data, file_path="qtable.json"):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
# Hàm lưu Q-table vào file


# Khởi tạo trạng thái ban đầu (lịch sử rỗng)
def initial_state():
    return '0' * history_length

# Chọn hành động dựa trên Q-table và epsilon-greedy
def choose_action(state):

    if (random.random() < epsilon) or (not q_table[state]):
        return random.choice(actions)
    else:
        max_q_value = max(q_table[state].values())
        best_actions = [action for action in actions if action in q_table[state] and q_table[state][action] == max_q_value]
        return random.choice(best_actions)
# Cập nhật Q-table
def update_q_table(state, action, reward, next_state):
    if state not in q_table:
        q_table[state] = {}
    if action not in q_table[state]:
        q_table[state][action] = 0
    current_q = q_table[state][action]
    if next_state not in q_table:
        q_table[next_state] = {}
    max_future_q = max(q_table[next_state].values(), default=0)  # Giá trị Q lớn nhất ở trạng thái tiếp theo
    new_q = current_q + alpha * (reward + gamma * max_future_q - current_q)
    q_table[state][action] = new_q


# Hàm nhận phần thưởng dựa trên kết quả
def get_reward(prediction, actual, bet):
    if prediction == actual:
        return bet  # Dự đoán đúng -> thưởng số điểm cược
    else:
        return -bet  # Dự đoán sai -> mất số điểm cược

# Hàm cập nhật trạng thái (lịch sử kết quả)
def update_state(state, result):
    if len(state) >= 3:
        state = state[-3:-1]
    return state[1:] + str(result)




# Khởi tạo Q-table
q_table = read_json_file()
actions = ["1_100", "1_200", "1_300", "1_500", "2_100", "2_200", "2_300", "2_500"]
state_length = 6  # Số lượng kết quả gần nhất lưu trong trạng thái
alpha = 0.1  # Tỷ lệ học
gamma = 0.9  # Tỷ lệ giảm
epsilon = 0.1  # Tỷ lệ khám phá
# Tải Q-table nếu đã tồn tại


# for i in range(10):
#     print(f"Vòng {i+1}, Tổng điểm hiện tại: {total_score}")
    
#     # Chọn hành động
#     action = choose_action(state)
#     prediction, bet = map(int, action.split('_'))
    
#     # Sinh ra kết quả ngẫu nhiên (0 hoặc 1)
#     actual_result = random.choice([0, 1])
    
#     # Nhận phần thưởng
#     reward = get_reward(prediction, actual_result, bet)
#     total_score += reward
    
#     # Cập nhật trạng thái
#     next_state = update_state(state, actual_result)
    
#     # Cập nhật Q-table
#     update_q_table(state, action, reward, next_state)
    
#     # Chuyển sang trạng thái mới
#     state = next_state

# Lưu Q-table sau khi chơi xong
# save_q_table(q_table)


