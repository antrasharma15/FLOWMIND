from pymongo import MongoClient
import sys

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self, uri, db_name):
        try:
            self.client = MongoClient(uri)
            # Trigger a connection to check if it's valid
            self.client.admin.command('ping')
            self.db = self.client[db_name]
            print(f"Successfully connected to MongoDB: {db_name}")
        except Exception as e:
            print(f"Could not connect to MongoDB: {e}")
            sys.exit(1)

    def get_db(self):
        return self.db

db = Database()
