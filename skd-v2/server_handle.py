import numpy as np
import os, json
from datetime import datetime
import time
from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import DecisionTreeRegressor
# from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
# from sklearn.neural_network import MLPRegressor
# from sklearn.preprocessing import MinMaxScaler
# scaler = MinMaxScaler()

def loadsJs(path):
    with open(path, 'r') as file:
        data = json.load(file)
    return data
def saveJs(path, data):
    with open(path, 'w') as file:
        json.dump(data, file, indent=4) 
class PRD:
    def __init__(self, model, name=""):
        self.model = model
        self.name = name
        self.prd = None
        self.score = 0
    def makePrd(self, x_train, y_train, x_test):
        
        self.model.fit(x_train, y_train)
        self.prd = int(self.model.predict([x_test])[0])
    def checkResult(self, result):
        if not  self.prd:
            return 0
        if self.prd %2 == result%2:
            if self.prd == result:
                self.score += 1
        else:
            self.score -=1
    def getTrend(self):
        return self.score
        # last_len = min(12, len(self.scoreHs))
        # return sum(self.scoreHs[-last_len:])




class DATA:
    def __init__(self):
        self.path = "./data/data.json"
        self.jsData = loadsJs(self.path)
    def addDt(self, dt):
        self.jsData.append(dt)
    def save(self):
        saveJs(self.path, self.jsData)

data_class = DATA()

# m1 = PRD(DecisionTreeClassifier(), "DecisionTreeClassifier")
# m2 = PRD(DecisionTreeRegressor(), "DecisionTreeRegressor")
# # m3 = PRD(LinearRegression(), "LinearRegression")
# # m4 = PRD(RandomForestRegressor(), "RandomForestRegressor")
# m5 = PRD(SVR(), "SVR")
# m6 = PRD(KNeighborsRegressor(n_neighbors=3), "KNeighborsRegressor")
# # m7 = PRD(MLPRegressor(hidden_layer_sizes=(50, 50), max_iter=1000))

# model_list = [m1, m2, m5, m6]