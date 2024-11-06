import numpy as np
import os
from datetime import datetime
import time
from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from sklearn.neural_network import MLPRegressor



        
class PRD:
    def __init__(self, model, name=""):
        self.model = model
        self.name = name
        self.prd = None
        self.true = 0
        self.false = 0
        self.persent = 0
    def makePrd(self, x_train, y_train, x_test):
        self.model.fit(x_train, y_train)
        self.prd = int(self.model.predict([x_test])[0])
    def checkResult(self, result):
        if not  self.prd:
            return 0
        if self.prd%2 == result%2:
            self.true += 1
        else:
            self.false += 1
        self.persent = self.true/(self.true + self.false)
    def show(self):
        print(self.true, self.false, self.persent, self.name)


class DATA:
    def __init__(self):
        self.path = "./data/prd/prd.txt"
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

data_class = DATA()

m1 = PRD(DecisionTreeClassifier(), "DecisionTreeClassifier")
m2 = PRD(DecisionTreeRegressor(), "DecisionTreeRegressor")
m3 = PRD(LinearRegression(), "LinearRegression")
m4 = PRD(RandomForestRegressor(), "RandomForestRegressor")
m5 = PRD(SVR(), "SVR")
m6 = PRD(KNeighborsRegressor(n_neighbors=3), "KNeighborsRegressor")
# m7 = PRD(MLPRegressor(hidden_layer_sizes=(50, 50), max_iter=1000))

model_list = [m1, m2, m3, m4, m5, m6]