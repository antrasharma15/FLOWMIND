from flask import Blueprint, current_app
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from utils.auth import token_required

analytics_bp = Blueprint("analytics", __name__, url_prefix="/analytics")

@analytics_bp.get("/")
@token_required
def get_full_analytics(current_user_id):
    """Combined endpoint for all analytics data with range and search filters."""
    try:
        from flask import request
        # 1. Fetch Summary
        summary_res, _ = get_summary(current_user_id)
        
        # 2. Fetch Trends
        trends_res, _ = get_productivity_trends(current_user_id)
        
        # 3. Fetch Focus Window
        focus_res, _ = get_focus_window(current_user_id)
        
        # 4. AI Insight (optional)
        # We can add an AI analysis here later
        
        return {
            "summary": summary_res,
            "trends": trends_res.get("data", []),
            "focus_window": focus_res.get("data", {})
        }, 200
    except Exception as e:
        print(f"Full Analytics Error: {e}")
        return {"error": str(e)}, 500

def build_query(user_id, date_range, search):
    """Utility to build MongoDB query based on user, range, and search."""
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    start_date = None
    
    if date_range == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif date_range == "this_week":
        start_date = now - timedelta(days=now.weekday())
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    elif date_range == "this_month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    query = {"user_id": user_id}
    if start_date:
        # We check tasks created or updated within the range
        query["created_at"] = {"$gte": start_date}
        
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"desc": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    return query

@analytics_bp.get("/summary")
@token_required
def get_summary(current_user_id):
    """Returns top-level metrics for the analytics dashboard with filtering."""
    try:
        from flask import request
        date_range = request.args.get("range", "this_month")
        search = request.args.get("search", "").strip()
        
        query = build_query(current_user_id, date_range, search)
            
        # 3. Fetch Metrics
        total = current_app.db.tasks.count_documents(query)
        completed = current_app.db.tasks.count_documents({**query, "status": "COMPLETED"})
        pending = total - completed
        
        # Priority Breakdown
        high = current_app.db.tasks.count_documents({**query, "priority": "HIGH PRIORITY"})
        medium = current_app.db.tasks.count_documents({**query, "priority": "MEDIUM"})
        low = current_app.db.tasks.count_documents({**query, "priority": "LOW"})
        
        # Calculate Overdue
        from dateutil import parser
        now = datetime.utcnow()
        overdue_count = 0
        active_tasks = current_app.db.tasks.find({
            **query,
            "status": {"$ne": "COMPLETED"},
            "due": {"$ne": ""}
        })
        for task in active_tasks:
            try:
                if parser.parse(task["due"]) < now:
                    overdue_count += 1
            except: continue

        return {
            "total": total,
            "completed": completed,
            "pending": pending,
            "overdue": overdue_count,
            "priorities": {"high": high, "medium": medium, "low": low},
            "range": date_range
        }, 200
    except Exception as e:
        print(f"Analytics Summary Error: {e}")
        return {"error": str(e)}, 500

@analytics_bp.get("/productivity")
@token_required
def get_productivity_trends(current_user_id):
    """Returns completion counts for the last 7 days with filtering."""
    try:
        from flask import request
        date_range = request.args.get("range", "this_month")
        search = request.args.get("search", "").strip()
        query_base = build_query(current_user_id, date_range, search)
        
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        days = []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            next_day = date + timedelta(days=1)
            
            count = current_app.db.tasks.count_documents({
                **query_base,
                "status": "COMPLETED",
                "updated_at": {"$gte": date, "$lt": next_day}
            })
            days.append({"day": date.strftime("%a"), "count": count})
            
        return {"data": days}, 200
    except Exception as e:
        return {"error": str(e)}, 500

@analytics_bp.get("/focus-window")
@token_required
def get_focus_window(current_user_id):
    """Aggregates completed tasks by hour with filtering."""
    try:
        from flask import request
        date_range = request.args.get("range", "this_month")
        search = request.args.get("search", "").strip()
        query_base = build_query(current_user_id, date_range, search)
        
        pipeline = [
            {
                "$match": {
                    **query_base,
                    "status": "COMPLETED", 
                    "updated_at": {"$exists": True}
                }
            },
            {
                "$project": {
                    "hour": {"$hour": "$updated_at"}
                }
            },
            {
                "$group": {
                    "_id": "$hour",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        results = list(current_app.db.tasks.aggregate(pipeline))
        
        # Initialize 24 hours with 0
        window_data = {str(i): 0 for i in range(24)}
        for res in results:
            window_data[str(res["_id"])] = res["count"]
            
        return {"data": window_data}, 200
    except Exception as e:
        return {"error": str(e)}, 500
@analytics_bp.get("/focus-score")
@token_required
def get_focus_score(current_user_id):
    """Calculates the Focus Score based on tasks and consistency."""
    try:
        from dateutil import parser
        
        # 1. Basic Stats
        total_tasks = current_app.db.tasks.count_documents({"user_id": current_user_id})
        completed_tasks = current_app.db.tasks.count_documents({"status": "COMPLETED", "user_id": current_user_id})
        
        # 2. Overdue Tasks
        now = datetime.utcnow()
        active_tasks = current_app.db.tasks.find({
            "user_id": current_user_id,
            "status": {"$ne": "COMPLETED"},
            "due": {"$ne": ""}
        })
        
        overdue_count = 0
        for task in active_tasks:
            try:
                due_date = parser.parse(task["due"])
                # If year is not specified, it might assume current year
                if due_date < now:
                    overdue_count += 1
            except:
                continue # Skip unparseable dates

        # 3. Consistency (Ratio of completed vs total, scaled 0-10)
        consistency = (completed_tasks / max(total_tasks, 1)) * 10
        
        # 4. Formula: (Completed * Consistency) / (Overdue + 1)
        score = (completed_tasks * consistency) / (overdue_count + 1)
        score = round(min(score * 10, 100)) # Scale to 0-100
        
        # Trend status (Random for now or based on recent completions)
        trend = "up" if score > 50 else "down"
        
        # Labels: Optimized, Stable, Overloaded, Low Focus
        if score >= 80:
            label = "Optimized"
        elif score >= 60:
            label = "Stable"
        elif score >= 40:
            label = "Overloaded"
        else:
            label = "Low Focus"
            
        return {
            "score": score,
            "label": label,
            "trend": trend,
            "metrics": {
                "completed": completed_tasks,
                "overdue": overdue_count,
                "consistency": round(consistency, 1)
            }
        }, 200
    except Exception as e:
        print(f"Focus Score Error: {e}")
        return {"error": str(e)}, 500

@analytics_bp.get("/productivity-score")
@token_required
def get_productivity_score(current_user_id):
    """Calculates the overall productivity score with filtering."""
    try:
        from flask import request
        date_range = request.args.get("range", "this_month")
        search = request.args.get("search", "").strip()
        query = build_query(current_user_id, date_range, search)
        
        total = current_app.db.tasks.count_documents(query)
        completed = current_app.db.tasks.count_documents({**query, "status": "COMPLETED"})
        
        score = (completed / max(total, 1)) * 100
        
        # Improvement trend (Mock for now)
        trend = "+12.5%" if score > 50 else "-2.1%"
        
        return {
            "score": round(score, 1),
            "trend": trend,
            "total": total,
            "completed": completed
        }, 200
    except Exception as e:
        print(f"Productivity Score Error: {e}")
        return {"error": str(e)}, 500

@analytics_bp.get("/trends")
@token_required
def get_trends(current_user_id):
    """Returns daily productivity trends with filtering."""
    try:
        from flask import request
        date_range = request.args.get("range", "this_month")
        search = request.args.get("search", "").strip()
        query_base = build_query(current_user_id, date_range, search)
        
        now = datetime.utcnow()
        last_week = now - timedelta(days=7)
        
        pipeline = [
            {
                "$match": {
                    **query_base,
                    "status": "COMPLETED",
                    "updated_at": {"$gte": last_week}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {"format": "%Y-%m-%d", "date": "$updated_at"}
                    },
                    "completed": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        results = list(current_app.db.tasks.aggregate(pipeline))
        
        # Fill missing days with 0
        days = []
        for i in range(7):
            day_date = (now - timedelta(days=6-i)).strftime("%Y-%m-%d")
            day_name = (now - timedelta(days=6-i)).strftime("%a")
            match = next((r for r in results if r["_id"] == day_date), None)
            days.append({
                "day": day_name,
                "date": day_date,
                "completed": match["completed"] if match else 0
            })
            
        return {"data": days}, 200
    except Exception as e:
        print(f"Trends API Error: {e}")
        return {"error": str(e)}, 500
