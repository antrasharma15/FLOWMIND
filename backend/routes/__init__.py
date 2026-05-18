from .health import health_bp
from .users import users_bp
from .tasks import tasks_bp
from .analytics import analytics_bp
from .insights import insights_bp
from .ai import ai_bp
from .search import search_bp

def register_routes(app):
    app.register_blueprint(health_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(insights_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(search_bp)
