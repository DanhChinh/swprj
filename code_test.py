# from sklearn.preprocessing import MinMaxScaler
import numpy as np

class DATA:
    def __init__(self):
        self.path = "./skd/data/prd/prd.txt"
        self.npdata = np.loadtxt(self.path, dtype=int)
        self.x_train = []
        self.y_train = []
    def split(self):
        
        self.x_train = self.npdata[:, :-1]
        self.y_train = self.npdata[:, -1]
    def addDt(self, dt):
        self.npdata = np.append(self.npdata, [dt], axis=0)
    def save(self):
        np.savetxt(self.path, self.npdata, fmt='%d')

def remove_min_element(arr):
    # Tìm giá trị nhỏ nhất
    min_value = np.min(arr)
    # Tìm vị trí đầu tiên của giá trị nhỏ nhất và loại bỏ phần tử này
    arr = np.delete(arr, np.where(arr == min_value)[0][0])
    return arr

arr = [1,0,-1,0,0,0,1]
print(sum(arr))

total = 0
chain = -0.1
for a in arr:
    if a==1:
        chain += 0.1
    if a==-1:
        chain = -0.1
    total += a+chain
print(total)