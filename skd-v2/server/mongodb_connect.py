
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
uri = "mongodb+srv://danhchinh2024:F6e8Km1c9GttzyMO@skd-v2.dde1q.mongodb.net/?retryWrites=true&w=majority&appName=skd-v2"

client = MongoClient(uri, server_api=ServerApi('1'))
db = client['skd']
collection = db['hkl']

def INSERT_ONE(document):
    result = collection.insert_one(document)
    print("Tài liệu đã được thêm với ID:", result.inserted_id)
def INSERT_MANY(documents):
    result = collection.insert_many(documents)
    print("Các tài liệu đã được thêm với ID:", result.inserted_ids)
def COLLECTION_FIND(filter_, projection=None):
    cursor = collection.find(filter_, projection)
    print("filter du lieu")
    return list(cursor)

# $gt: Lớn hơn.
# $lt: Nhỏ hơn.
# $gte: Lớn hơn hoặc bằng.
# $lte: Nhỏ hơn hoặc bằng.
# $eq: Bằng.
# $ne: Khác.

