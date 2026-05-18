from flask import Blueprint, current_app, request
from services.ai_service import AIService
from utils.auth import token_required
from datetime import datetime

from bson.objectid import ObjectId

ai_bp = Blueprint("ai", __name__, url_prefix="/ai")

def get_user_ai_mode(user_id):
    """Fetch user's AI preference mode from the database."""
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    return user.get("aiPreference", "Balanced") if user else "Balanced"

@ai_bp.post("/schedule")
@token_required
def apply_schedule(current_user_id):
    """Generates and applies an AI-optimized schedule for the user."""
    try:
        # 1. Fetch active tasks
        tasks = list(current_app.db.tasks.find({
            "user_id": current_user_id,
            "status": {"$ne": "COMPLETED"}
        }))

        if not tasks:
            return {"message": "No active tasks to schedule"}, 200

        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY is not configured"}, 400

        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        schedule = ai_service.generate_smart_schedule(tasks, mode=mode)

        if schedule:
            from bson import ObjectId
            # 2. Update user's AI schedule in the database
            current_app.db.users.update_one(
                {"_id": ObjectId(current_user_id)},
                {"$set": {
                    "last_ai_schedule": schedule,
                    "schedule_updated_at": datetime.utcnow()
                }}
            )

            # 3. Optionally update task execution order metadata if needed
            # For now, we'll just return the schedule to the frontend
            
            return {
                "message": "Schedule optimized by AI",
                "summary": schedule.get("schedule_recommendation", "Schedule updated."),
                "data": schedule
            }, 200
        
        return {"error": "AI failed to generate schedule"}, 500
    except Exception as e:
        print(f"Schedule API Error: {e}")
        return {"error": str(e)}, 500

@ai_bp.get("/intelligence")
@token_required
def get_productivity_intelligence(current_user_id):
    """Provides deep AI productivity analysis."""
    try:
        tasks = list(current_app.db.tasks.find({"user_id": current_user_id}).sort("created_at", -1).limit(50))
        
        # Get stats summary
        total = current_app.db.tasks.count_documents({"user_id": current_user_id})
        completed = current_app.db.tasks.count_documents({"status": "COMPLETED", "user_id": current_user_id})
        stats = {"total": total, "completed": completed, "rate": (completed/max(total, 1))*100}

        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY not configured"}, 400
            
        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        intelligence = ai_service.analyze_productivity_intelligence(tasks, stats, mode=mode)
        
        if intelligence:
            return intelligence, 200
            
        return {"error": "AI failed to generate intelligence"}, 500
    except Exception as e:
        print(f"Intelligence API Error: {e}")
        return {"error": str(e)}, 500

@ai_bp.get("/burnout-analysis")
@token_required
def burnout_analysis(current_user_id):
    """Analyzes the user's workload for burnout risk using AI."""
    try:
        tasks = list(current_app.db.tasks.find({"user_id": current_user_id}))
        
        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY not configured"}, 400
            
        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        analysis = ai_service.analyze_burnout(tasks, mode=mode)
        
        if analysis:
            return analysis, 200
            
        return {"error": "AI failed to analyze burnout"}, 500
    except Exception as e:
        print(f"Burnout API Error: {e}")
        return {"error": str(e)}, 500

@ai_bp.post("/predict")
@token_required
def predict_productivity(current_user_id):
    """Predicts future productivity metrics using AI."""
    try:
        tasks = list(current_app.db.tasks.find({"user_id": current_user_id}))
        
        # Get analytics summary for context
        total = current_app.db.tasks.count_documents({"user_id": current_user_id})
        completed = current_app.db.tasks.count_documents({"status": "COMPLETED", "user_id": current_user_id})
        summary = f"Total: {total}, Completed: {completed}, Pending: {total - completed}"

        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY not configured"}, 400
            
        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        prediction = ai_service.predict_productivity(tasks, summary, mode=mode)
        
        if prediction:
            return prediction, 200
            
        return {"error": "AI failed to generate prediction"}, 500
    except Exception as e:
        print(f"Prediction API Error: {e}")
        return {"error": str(e)}, 500

@ai_bp.get("/analytics-insight")
@token_required
def get_analytics_insight(current_user_id):
    """Provides a short actionable AI insight."""
    try:
        # Get stats summary
        total = current_app.db.tasks.count_documents({"user_id": current_user_id})
        completed = current_app.db.tasks.count_documents({"status": "COMPLETED", "user_id": current_user_id})
        high = current_app.db.tasks.count_documents({"priority": "high", "user_id": current_user_id})
        stats = {"total": total, "completed": completed, "high_priority": high}

        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY not configured"}, 400
            
        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        insight = ai_service.analyze_distribution_insight(stats, mode=mode)
        
        return {"insight": insight}, 200
    except Exception as e:
        print(f"Analytics Insight API Error: {e}")
        return {"error": str(e)}, 500
