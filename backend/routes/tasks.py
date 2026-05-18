from flask import Blueprint, current_app, request
from bson.objectid import ObjectId
from datetime import datetime
from services.ai_service import AIService
from utils.auth import token_required

tasks_bp = Blueprint("tasks", __name__, url_prefix="/tasks")

def get_user_ai_mode(user_id):
    """Fetch user's AI preference mode from the database."""
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    return user.get("aiPreference", "Balanced") if user else "Balanced"

@tasks_bp.get("/stats")
@token_required
def get_task_stats(current_user_id):
    try:
        total_tasks = current_app.db.tasks.count_documents({"user_id": current_user_id})
        completed_tasks = current_app.db.tasks.count_documents({"status": "COMPLETED", "user_id": current_user_id})
        pending_tasks = total_tasks - completed_tasks
        
        # Priority counts
        high_priority = current_app.db.tasks.count_documents({"priority": "HIGH PRIORITY", "user_id": current_user_id})
        medium_priority = current_app.db.tasks.count_documents({"priority": "MEDIUM", "user_id": current_user_id})
        low_priority = current_app.db.tasks.count_documents({"priority": "LOW", "user_id": current_user_id})
        
        return {
            "total": total_tasks,
            "completed": completed_tasks,
            "pending": pending_tasks,
            "priorities": {
                "high": high_priority,
                "medium": medium_priority,
                "low": low_priority
            }
        }, 200
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.get("/distribution")
@token_required
def get_task_distribution(current_user_id):
    """Calculates task distribution over the last 7 days."""
    try:
        from datetime import timedelta
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=6)
        
        # Initialize counts for each day
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        # Get current day index (0=Mon, 6=Sun)
        current_day_idx = end_date.weekday()
        
        # Reorder days to end with today
        ordered_days = []
        for i in range(7):
            idx = (current_day_idx - 6 + i) % 7
            ordered_days.append(days[idx])
            
        distribution = {day: 0 for day in ordered_days}
        
        tasks = list(current_app.db.tasks.find({
            "user_id": current_user_id,
            "created_at": {"$gte": start_date}
        }))
        
        for task in tasks:
            created_at = task.get("created_at")
            if created_at:
                day_name = created_at.strftime("%a")
                if day_name in distribution:
                    distribution[day_name] += 1
        
        result = [{"day": day, "count": count} for day, count in distribution.items()]
        return {"data": result}, 200
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.post("/prioritize")
@token_required
def prioritize_tasks(current_user_id):
    """Uses Gemini AI to prioritize all pending tasks."""
    try:
        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY is not configured"}, 400

        payload = request.get_json(silent=True) or {}
        requested_tasks = payload.get("tasks") or []
        task_ids = []
        for task in requested_tasks:
            task_id = task.get("_id") if isinstance(task, dict) else None
            if task_id and ObjectId.is_valid(task_id):
                task_ids.append(ObjectId(task_id))

        base_query = {"status": {"$ne": "COMPLETED"}, "user_id": current_user_id}
        if task_ids:
            base_query["_id"] = {"$in": task_ids}

        # 1. Fetch all pending tasks for this user
        tasks = list(current_app.db.tasks.find(base_query))
        if not tasks:
            return {"message": "No pending tasks to prioritize"}, 200
            
        for task in tasks:
            task["_id"] = str(task["_id"])
            
        # 2. Get AI recommendations
        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        recommendations = ai_service.prioritize_tasks(tasks, mode=mode)
        
        if not recommendations:
            return {
                "error": "AI failed to generate recommendations",
                "hint": "Check GEMINI_API_KEY and Gemini response format.",
            }, 502
            
        color_map = {
            "HIGH PRIORITY": "border-l-[#ff4d4d]",
            "MEDIUM": "border-l-[#b7bdff]",
            "LOW": "border-l-gray-500",
        }

        task_title_map = {str(task["_id"]): task.get("title", "") for task in tasks}

        # 3. Update tasks in database
        for rec in recommendations:
            if not isinstance(rec, dict):
                return {"error": "AI returned invalid recommendation format"}, 502

            rec_id = rec.get("_id")
            if not rec_id or not ObjectId.is_valid(rec_id):
                return {"error": "AI returned invalid task id", "bad_id": rec_id}, 502

            priority = str(rec.get("priority", "MEDIUM")).upper()
            if priority not in {"HIGH PRIORITY", "MEDIUM", "LOW"}:
                priority = "MEDIUM"

            urgency = str(rec.get("urgency", "MEDIUM")).upper()
            if urgency not in {"HIGH", "MEDIUM", "LOW"}:
                urgency = "MEDIUM"

            color = color_map.get(priority, "border-l-gray-500")
            current_app.db.tasks.update_one(
                {"_id": ObjectId(rec_id)},
                {"$set": {
                    "priority": priority,
                    "aiLabel": rec.get("aiLabel", "AI: Prioritization updated."),
                    "aiUrgency": urgency,
                    "aiReason": rec.get("reason", ""),
                    "color": color,
                    "updated_at": datetime.utcnow()
                }}
            )

        priority_rank = {"HIGH PRIORITY": 3, "MEDIUM": 2, "LOW": 1}
        top_rec = max(
            recommendations,
            key=lambda rec: priority_rank.get(rec.get("priority", "MEDIUM"), 0),
        ) if recommendations else None

        summary_message = "Tasks prioritized by AI"
        if top_rec:
            title = task_title_map.get(top_rec.get("_id", ""), "")
            reason = top_rec.get("reason") or "Priority adjusted based on workload."
            priority = top_rec.get("priority", "MEDIUM")
            if title:
                summary_message = f"Urgency: {priority}. {title} - {reason}"
            else:
                summary_message = f"Urgency: {priority}. {reason}"

        return {"message": "Tasks prioritized by AI", "summary": summary_message, "data": recommendations}, 200
        
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.get("")
@token_required
def list_tasks(current_user_id):
    try:
        search = (request.args.get("search") or "").strip()
        query = {"user_id": current_user_id}

        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"desc": {"$regex": search, "$options": "i"}},
                {"tags": {"$regex": search, "$options": "i"}},
                {"aiLabel": {"$regex": search, "$options": "i"}},
            ]

        tasks = list(current_app.db.tasks.find(query))
        for task in tasks:
            task["_id"] = str(task["_id"])
        if search and not tasks:
            return {"data": [], "message": "Tasks not found"}, 200
        return {"data": tasks}, 200
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.patch("/<task_id>")
@token_required
def update_task(current_user_id, task_id):
    """Update task fields (e.g., status, priority)."""
    try:
        if not ObjectId.is_valid(task_id):
            return {"error": "Invalid task ID"}, 400
        
        payload = request.get_json(silent=True) or {}
        update_data = {k: v for k, v in payload.items() if k != "_id"}
        update_data["updated_at"] = datetime.utcnow()

        result = current_app.db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return {"error": "Task not found"}, 404
            
        return {"message": "Task updated successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.post("")
@token_required
def create_task(current_user_id):
    try:
        payload = request.get_json(silent=True) or {}
        if not payload.get("title"):
            return {"error": "Title is required"}, 400
        
        task_data = {
            "title": payload.get("title"),
            "desc": payload.get("desc", ""),
            "priority": payload.get("priority", "MEDIUM"),
            "due": payload.get("due", ""),
            "status": payload.get("status", "PENDING"),
            "aiLabel": payload.get("aiLabel", "AI: New task analyzed."),
            "color": payload.get("color", "border-l-gray-500"),
            "tags": payload.get("tags", ""),
            "user_id": current_user_id,
            "created_at": datetime.utcnow()
        }
        
        result = current_app.db.tasks.insert_one(task_data)
        task_data["_id"] = str(result.inserted_id)
        
        return {"data": task_data}, 201
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.delete("/<task_id>")
@token_required
def delete_task(current_user_id, task_id):
    try:
        if not ObjectId.is_valid(task_id):
            return {"error": "Invalid task ID"}, 400
        
        result = current_app.db.tasks.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 0:
            return {"error": "Task not found"}, 404
            
        return {"message": "Task deleted successfully"}, 200
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.post("/<task_id>/analyze")
@token_required
def get_task_analysis(current_user_id, task_id):
    """Uses Gemini to generate subtasks and strategic insights for a task."""
    try:
        if not ObjectId.is_valid(task_id):
            return {"error": "Invalid task ID"}, 400
            
        task = current_app.db.tasks.find_one({"_id": ObjectId(task_id), "user_id": current_user_id})
        if not task:
            return {"error": "Task not found"}, 404
            
        api_key = current_app.config.get("GEMINI_API_KEY")
        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        analysis = ai_service.analyze_task(task, mode=mode)
        
        if analysis:
            # Save analysis results back to the task in MongoDB
            current_app.db.tasks.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": {"ai_analysis": analysis}}
            )
            return {"data": analysis}, 200
        else:
            return {"error": "AI failed to analyze task"}, 500
    except Exception as e:
        return {"error": str(e)}, 500

@tasks_bp.post("/optimize")
@token_required
def optimize_tasks(current_user_id):
    """Trigger AI optimization protocol for all active tasks."""
    try:
        tasks = list(current_app.db.tasks.find({
            "user_id": current_user_id,
            "status": {"$ne": "COMPLETED"}
        }))
        
        if not tasks:
            return {"message": "No active tasks to optimize"}, 200

        api_key = current_app.config.get("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY is not configured"}, 400
            
        ai_service = AIService(api_key)
        mode = get_user_ai_mode(current_user_id)
        recommendations = ai_service.prioritize_tasks(tasks, mode=mode)
        
        if not recommendations:
            return {"error": "AI failed to generate optimization recommendations"}, 502
            
        # Color map for priority consistency
        color_map = {
            "HIGH PRIORITY": "border-l-[#ff4d4d]",
            "MEDIUM": "border-l-[#b7bdff]",
            "LOW": "border-l-gray-500",
        }

        updated_count = 0
        for rec in recommendations:
            if not isinstance(rec, dict):
                continue
                
            task_id = rec.get("_id")
            if not task_id or not ObjectId.is_valid(task_id):
                continue

            priority = str(rec.get("priority", "MEDIUM")).upper()
            if priority not in {"HIGH PRIORITY", "MEDIUM", "LOW"}:
                priority = "MEDIUM"
                
            urgency = str(rec.get("urgency", "MEDIUM")).upper()
            color = color_map.get(priority, "border-l-gray-500")

            current_app.db.tasks.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": {
                    "priority": priority,
                    "aiUrgency": urgency, # Align with other route
                    "aiReason": rec.get("reason", ""),
                    "aiLabel": rec.get("aiLabel", "AI: Optimized"),
                    "color": color, # Ensure color is updated
                    "updated_at": datetime.utcnow()
                }}
            )
            updated_count += 1
        
        summary_message = f"Optimization protocol executed. {updated_count} tasks synced with neural dashboard."
        return {"message": "System Optimized", "summary": summary_message}, 200
            
    except Exception as e:
        print(f"Optimization Error: {e}")
        return {"error": f"Optimization failed: {str(e)}"}, 500
