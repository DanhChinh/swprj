
import numpy as np 
from sklearn.tree import DecisionTreeClassifier
# model = DecisionTreeClassifier()
def npdataToXY(npdata):
    x_train = npdata[:, :-1]
    y_train = npdata[:, -1]
    return x_train, y_train
def splitNpdata(npdata, l=100):
    return npdata[:-l], npdata[-l:]


npdata = np.loadtxt("./data/prd/prd.txt", dtype=int)
Ltest = 100
x_train, y_train = npdataToXY(npdata)
x_train, x_test = splitNpdata(x_train, Ltest)
y_train, y_test = splitNpdata(y_train, Ltest)


def getScore(model, x_train, y_train, x_test, y_test):
    isTrue = 0
    isFale = 0
    model.fit(x_train, y_train) 
    for i in range(Ltest):
        xt = x_test[i]
        rs = y_test[i]
        # print(x_train)
        # print(y_train)
        prd = model.predict([xt])[0]
        if prd%2 == rs%2:
            isTrue += 1
        else:
            isFale += 1
        # print(f"True: {isTrue}, False: {isFale}, Prd: {prd}, Real: {rs}")
        # x_train = np.append(x_train, [xt], axis=0)
        # y_train = np.append(y_train, [rs], axis=0)
        # print(y_train)
        # break
    return isTrue/ (isTrue + isFale)

score = getScore(DecisionTreeClassifier(), x_train, y_train, x_test, y_test)
print(score)