# from server_handle import *
import numpy as np



def OBJLIST_2_MATRIX(OBJLIST):
    MATRIX = []
    for obj in OBJLIST:
        row = [obj["hours"], obj["profitS"], obj["result"]]
        MATRIX.append(row)
    return MATRIX

def loadsJs(path):
    with open(path, 'r') as file:
        data = json.load(file)
    return data
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
    result = OBJ['result']
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
    return [hours] + profitS + usersTop100_2Arr + counter + [result]
    




# objlist_filter = loadsJs("./data/data.json")[:3]
# matrix = OBJLIST_2_MATRIX(objlist_filter)
# print(matrix)

# x_train = matrix

npdata = np.array([[1,2,3],
                    [4,5,6],
                    [7,8,9]])
print(npdata)
x_train = npdata[:, :-1]
y_train = npdata[:, -1]
print(x_train)
print(y_train)