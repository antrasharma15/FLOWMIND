from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv('.env')
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "FlowMind")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

users = list(db.users.find({}, {'password': 1, 'email': 1}))
print(f"Found {len(users)} users.")
for user in users:
    pwd = user.get('password')
    print(f"Email: {user.get('email')}, Password Type: {type(pwd)}, Password Value (first 10): {str(pwd)[:10]}...")
