from flask import Blueprint, current_app
from services.ai_service import AIService
from utils.auth import token_required

from bson.objectid import ObjectId

insights_bp = Blueprint("insights", __name__, url_prefix="/insights")

def get_user_ai_mode(user_id):
    """Fetch user's AI preference mode from the database."""
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    return user.get("aiPreference", "Balanced") if user else "Balanced"

@insights_bp.get("/report")
@token_required
def get_insights_report(current_user_id):
    """Generates a high-level AI productivity report for the user."""
    try:
        # 1. Fetch recent tasks (mix of pending and completed for consistency analysis)
        tasks = list(current_app.db.tasks.find({
            "user_id": current_user_id
        }).sort("created_at", -1).limit(20))
        
        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY is not configured"}, 400

        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        report = ai_service.analyze_workload(tasks, mode=mode) or {}

        high_priority_tasks = [
            task for task in tasks if task.get("priority") == "HIGH PRIORITY"
        ]
        if high_priority_tasks:
            urgency = ai_service.generate_urgency_insight(high_priority_tasks, mode=mode)
            if urgency:
                report["urgency_level"] = urgency.get("urgency_level")
                report["urgency_message"] = urgency.get("urgency_message")
                report["focus_suggestion"] = urgency.get("focus_suggestion")
        
        if report:
            print(f"Generated workload report: {report}")
            return {"data": report}, 200
        print("Failed to generate workload report")
        return {"error": "AI failed to generate workload report"}, 500
    except Exception as e:
        return {"error": str(e)}, 500

@insights_bp.get("/overview")
@token_required
def get_ai_overview(current_user_id):
    """Generates a personalized AI cognitive overview."""
    try:
        from bson import ObjectId
        # 1. Fetch user profile
        user = current_app.db.users.find_one({"_id": ObjectId(current_user_id)})
        user_name = user.get("name", "User") if user else "User"

        # 2. Fetch all active/overdue tasks
        tasks = list(current_app.db.tasks.find({
            "user_id": current_user_id,
            "status": {"$ne": "COMPLETED"}
        }))

        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY is not configured"}, 400

        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        overview = ai_service.generate_overview(tasks, mode=mode)

        if overview:
            overview["user_name"] = user_name
            return {"data": overview}, 200
        
        return {"error": "AI failed to generate overview"}, 500
    except Exception as e:
        print(f"Overview API Error: {e}")
        return {"error": str(e)}, 500
