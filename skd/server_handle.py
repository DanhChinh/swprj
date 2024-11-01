import numpy as np
import os
from datetime import datetime
import time
def getTextTime():
    current_time = datetime.now()
    return current_time.strftime("%Y%m%d%H%M%S")

def loadFile(path ):
    if os.path.exists(path):
        return  np.loadtxt(path, dtype=int)
    return []

def saveFile(path, data):
    np.savetxt(path, data, fmt='%d')

def loadAllFile(directory="data/trend"):
    # Lặp qua tất cả các file trong thư mục
    data = []
    for filename in os.listdir(directory):
        if filename.endswith('.txt'):  # Bạn có thể thay đổi đuôi file nếu cần
            file_path = os.path.join(directory, filename)
            print(file_path)
            # Tải dữ liệu từ file
            dt = np.loadtxt(file_path, dtype=int)
            data.append(dt)
    return data

def makeTestData():
    for i in range(10):
        data = np.random.randint(0, 10, size=(3, 4))
        saveFile(f"./data/trend/{getTextTime()}.txt", data)
        time.sleep(1)
        print(i)
    print("Make test datat: done")

makeTestData()