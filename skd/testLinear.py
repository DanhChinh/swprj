import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import random
# Mảng dữ liệu ban đầu
total = 0
history = [ random.randint(-100, 100) for i in range(100)]
data = []
for h in history:
    total += h
    data.append(total)
# data = np.array([2, 4, 6, 8, 10, 12, 14, 16, 18, 20])

# Chuẩn bị dữ liệu cho mô hình hồi quy tuyến tính
X = np.arange(len(data)).reshape(-1, 1)  # Chỉ số
y = data

# Huấn luyện mô hình hồi quy tuyến tính
model = LinearRegression()
model.fit(X, y)

# Tạo chỉ số cho 10 điểm dữ liệu tiếp theo
X_future = np.arange(len(data), len(data) + 20).reshape(-1, 1)
y_future = model.predict(X_future)

# Vẽ đồ thị
plt.figure(figsize=(10, 6))
plt.plot(X, y, color='blue', marker='o', label='Dữ liệu gốc')  # Đường và điểm của dữ liệu ban đầu
plt.plot(X_future, y_future, color='red', marker='x', linestyle='--', label='Dự đoán')  # Đường và điểm của dự đoán

# Thêm chú thích và hiển thị
plt.xlabel('Index')
plt.ylabel('Value')
plt.title('Dự đoán cho 10 điểm tiếp theo')
plt.legend()
plt.grid(True)
plt.show()
