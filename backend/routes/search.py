from flask import Blueprint, current_app, request
from utils.auth import token_required
from bson.objectid import ObjectId

search_bp = Blueprint("search", __name__, url_prefix="/api/search")

@search_bp.get("")
@token_required
def global_search(current_user_id):
    """
    Globally search tasks, analytics context, and AI insights.
    """
    try:
        query = request.args.get("q", "").strip()
        if not query:
            return {"data": []}, 200
            
        results = []
        
        # 1. Search Tasks (Title, Description, Tags)
        tasks = list(current_app.db.tasks.find({
            "user_id": current_user_id,
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"desc": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}},
                {"aiLabel": {"$regex": query, "$options": "i"}}
            ]
        }).limit(8))
        
        for t in tasks:
            results.append({
                "id": str(t["_id"]),
                "title": t["title"],
                "type": "Task",
                "category": "productivity",
                "subtitle": f"Priority: {t.get('priority', 'MEDIUM')}",
                "url": f"/tasks?id={t['_id']}"
            })
            
        # 2. Search AI Insights / Strategic reasoning
        ai_insights = list(current_app.db.tasks.find({
            "user_id": current_user_id,
            "$or": [
                {"aiReason": {"$regex": query, "$options": "i"}},
                {"ai_analysis.focus_tip": {"$regex": query, "$options": "i"}}
            ]
        }).limit(5))
        
        for t in ai_insights:
            # Avoid duplication if already in tasks
            if not any(r['id'] == str(t['_id']) and r['type'] == 'Task' for r in results):
                results.append({
                    "id": f"ai-{t['_id']}",
                    "title": t.get('aiLabel', 'Neural Analysis'),
                    "type": "AI Insight",
                    "category": "intelligence",
                    "subtitle": t.get('aiReason', 'Cognitive strategy'),
                    "url": "/insights"
                })

        # 3. Add a placeholder for Analytics (simulated as it's computed)
        if "analytics" in query.lower() or "report" in query.lower() or "trend" in query.lower():
            results.append({
                "id": "global-analytics",
                "title": "Production Intelligence Report",
                "type": "Analytics",
                "category": "performance",
                "subtitle": "Weekly productivity trends and burnout analysis",
                "url": "/insights"
            })

        return {"data": results}, 200
    except Exception as e:
        print(f"Search API Error: {e}")
        return {"error": str(e)}, 500
