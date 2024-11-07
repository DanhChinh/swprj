import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler

# Dữ liệu mẫu (giả sử chúng ta có một bộ dữ liệu)
X = np.random.rand(100, 10)  # 100 mẫu, mỗi mẫu có 10 đặc trưng
y = np.random.randint(0, 2, size=100)  # Nhãn phân loại (0 hoặc 1)

# Chia dữ liệu thành tập huấn luyện và kiểm tra
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Chuẩn hóa dữ liệu (vì một số mô hình như SVM yêu cầu dữ liệu chuẩn hóa)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Khai báo các mô hình cơ sở
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
svm_model = SVC(probability=True, random_state=42)
logreg_model = LogisticRegression(random_state=42)

# Huấn luyện các mô hình cơ sở
rf_model.fit(X_train_scaled, y_train)
svm_model.fit(X_train_scaled, y_train)
logreg_model.fit(X_train_scaled, y_train)

# Dự đoán từ các mô hình cơ sở
rf_pred = rf_model.predict(X_test_scaled)
svm_pred = svm_model.predict(X_test_scaled)
logreg_pred = logreg_model.predict(X_test_scaled)

# Tính toán xác suất dự đoán (để mô hình meta có thể sử dụng)
rf_prob = rf_model.predict_proba(X_test_scaled)[:, 1]
svm_prob = svm_model.predict_proba(X_test_scaled)[:, 1]
logreg_prob = logreg_model.predict_proba(X_test_scaled)[:, 1]

# Tạo tập dữ liệu đầu vào cho meta-learner (các xác suất dự đoán từ các mô hình cơ sở)
meta_X = np.vstack([rf_prob, svm_prob, logreg_prob]).T

# Huấn luyện meta-learner (Logistic Regression) để học cách chọn mô hình tốt nhất
meta_learner = LogisticRegression(random_state=42)
meta_learner.fit(meta_X, y_test)

# Dự đoán từ meta-learner
meta_pred = meta_learner.predict(meta_X)

# Đánh giá hiệu suất của từng mô hình cơ sở và meta-learner
print(f"Accuracy of Random Forest: {accuracy_score(y_test, rf_pred):.4f}")
print(f"Accuracy of SVM: {accuracy_score(y_test, svm_pred):.4f}")
print(f"Accuracy of Logistic Regression: {accuracy_score(y_test, logreg_pred):.4f}")
print(f"Accuracy of Meta-learner: {accuracy_score(y_test, meta_pred):.4f}")

