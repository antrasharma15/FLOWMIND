import os
from bson.objectid import ObjectId
from services.ai_service import AIService
from dotenv import load_dotenv

load_dotenv('.env')
api_key = os.getenv("GEMINI_API_KEY")

tasks = [
    {"_id": ObjectId(), "title": "Finish Project", "priority": "MEDIUM", "due": "2024-05-15", "desc": "Complete the task manager"},
    {"_id": ObjectId(), "title": "Buy Milk", "priority": "LOW", "due": "2024-05-12", "desc": "Get groceries"},
]

ai_service = AIService(api_key)
print("Running prioritize_tasks...")
recommendations = ai_service.prioritize_tasks(tasks)
print(f"Recommendations: {recommendations}")
