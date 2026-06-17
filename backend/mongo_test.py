from pymongo import MongoClient

MONGO_URI = "mongodb+srv://admin:StrongPassword123@hr-attrition-cluster.2rbpxld.mongodb.net/hr_attrition_db?retryWrites=true&w=majority&appName=hr-attrition-cluster"

client = MongoClient(MONGO_URI)

db = client["hr_attrition_db"]

print("MongoDB Connected Successfully!")