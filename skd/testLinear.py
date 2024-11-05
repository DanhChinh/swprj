
import numpy as np 
from sklearn.tree import DecisionTreeClassifier
model = DecisionTreeClassifier()
def make_prd(data, X_test):
    X_train = data[:, :-1]
    y_train = data[:, -1]
    model.fit(X_train, y_train)
    return model.predict(X_test)[0]
