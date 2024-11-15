import numpy as np
from scipy import stats
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from mongodb_connect import COLLECTION_FIND
from datetime import datetime

# Lấy giờ hiện tại theo định dạng 24 giờ
def get_current_hour():
    return int(datetime.now().strftime('%H'))

def FILTER_OBJ(OBJLIST, OBJ):
    OBJLIST_FILTER = []
    for index in range(-5, 0, 1):
        OBJLIST_FILTER = filter(
            lambda record: record["history52"][index:] == OBJ["history52"][index:], OBJLIST
        )
        OBJLIST_FILTER = list(OBJLIST_FILTER)
        if len(OBJLIST_FILTER)>30:
            return OBJLIST_FILTER
    return []


def OBJLIST_2_MATRIX(OBJLIST):
    MATRIX = []
    for obj in OBJLIST:
        row = OBJ_2_ARR1D(obj)
        MATRIX.append(row)
    return np.array(MATRIX)

def work_width_hours(hours):
    return [hours//6, hours]
def work_width_profitS(data):
    numeric = [np.mean(data), np.median(data), np.var(data), np.std(data), np.max(data) - np.min(data), np.percentile(data, 25), np.percentile(data, 75), stats.skew(data), stats.kurtosis(data)]
    return data[-5:] + numeric
def work_width_userS(userS):
    usersTop100 = userS[-100:]
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
    return [len(userS), total_2, total_5] + counter 
def work_width_history52(history52):
    hs = history52[-10:]
    historybinary = [i%2 for i in history52]
    total_1 = sum(historybinary)
    total_2 = len(historybinary) - total_1
    return [total_1, total_2, history52.count(0), history52.count(1), history52.count(2), history52.count(3), history52.count(4)] + hs 

def OBJ_2_ARR1D(OBJ):
    o = work_width_hours(OBJ["hours"])
    p = work_width_profitS(OBJ["profitS"])
    u = work_width_userS(OBJ["userS"])
    h = work_width_history52(OBJ["history52"])
    arr = o + p + u + h
    if "result" in OBJ.keys():
        result = OBJ["result"]      
        return arr + [result]
    return arr


 
class PRD:
    def __init__(self, model, name, neighbors):
        self.model = model
        self.name = name
        self.prd = None
        self.score = 0
        self.neighbors = neighbors
    def makePrd(self, x_train, y_train, x_test):
        if len(x_train)<self.neighbors:
            return None
        
        self.model.fit(x_train, y_train)
        self.prd = int(self.model.predict([x_test])[0])
    def checkResult(self, result):
        if self.prd == None:
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
        print("Khoi dong class Data")
        self.current_hour = get_current_hour()
        self.mongoDB =COLLECTION_FIND({}) #COLLECTION_FIND({"hours":self.current_hour})
        self.js = None 
    def upDateMongoDB(self):
        self.mongoDB =COLLECTION_FIND({})

        # hours = get_current_hour()
        # if hours != self.current_hour:
        #     print("pull data...")
        #     self.current_hour = hours
        #     self.mongoDB =COLLECTION_FIND({"hours":hours})
        #     print("done")

data = DATA()

m1 = PRD(KNeighborsRegressor(n_neighbors=3), "KNeighborsRegressor_3", 3)
m2 = PRD(KNeighborsRegressor(n_neighbors=5), "KNeighborsRegressor_5", 5)
m3 = PRD(KNeighborsRegressor(n_neighbors=7), "KNeighborsRegressor_7", 7)
m4 = PRD(KNeighborsRegressor(n_neighbors=9), "KNeighborsRegressor_9", 9)
model_list = [m1, m2, m3, m4]

