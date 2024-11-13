from server_handle import *


data = data_class.jsData
x_test = data[-1]
print(x_test["history52"][-2:])
data_filter = filter(
    lambda record: record["history52"][-1:] == x_test["history52"][-1:], data
)


print(len(data_filter))