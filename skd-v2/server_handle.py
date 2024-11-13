import numpy as np
import os, json
from datetime import datetime
import time
from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor


def FILTER_OBJ(OBJLIST, OBJ):
    OBJLIST_FILTER = filter(
        lambda record: record["history52"][-2:] == OBJ["history52"][-2:], OBJLIST
    )
    return list(OBJLIST_FILTER)


def OBJLIST_2_MATRIX(OBJLIST):
    MATRIX = []
    for obj in OBJLIST:
        row = OBJ_2_ARR1D(obj)
        MATRIX.append(row)
    return np.array(MATRIX)

def OBJ_2_ARR1D(OBJ):
    hours = OBJ['hours']
    profitS = OBJ['profitS']
    usersTop100 = OBJ['userS'][-100:]
    counter = [0,0,0,0,0,0]
    total_2 = 0
    total_5 = 0
    usersTop100_2Arr = []
    for user in usersTop100:
        for i in range(6):
            if user[str(i)]:
                counter[i]+=1
            usersTop100_2Arr.append(user[str(i)])
        usersTop100_2Arr.append(user["m"])
        if user["2"]:
            total_2 += user["m"]
        if user["5"]:
            total_5 += user["m"]
    if "result" in OBJ.keys():
        result = OBJ["result"]      
        return [hours] + profitS + usersTop100_2Arr + counter + [result]
    return [hours] + profitS + usersTop100_2Arr + counter


def loadsJs(path):
    with open(path, 'r') as file:
        data = json.load(file)
    return data
def saveJs(path, data):
    print(f"Saving: {path}", end=" ")
    with open(path, 'w') as file:
        json.dump(data, file, indent=4)
    print("->done") 
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

m1 = PRD(DecisionTreeClassifier(), "DecisionTreeClassifier")
m2 = PRD(DecisionTreeRegressor(), "DecisionTreeRegressor")
m5 = PRD(SVR(), "SVR")
m6 = PRD(KNeighborsRegressor(n_neighbors=3), "KNeighborsRegressor")

model_list = [m1, m2, m5, m6]