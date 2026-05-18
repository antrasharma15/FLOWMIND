from flask import Flask
from flask_cors import CORS
from config import Config
from database import db
from routes import register_routes

def create_app():
    """Application factory for FLOWMIND."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}})

    # Initialize Database
    if not app.config.get("MONGO_URI"):
        raise RuntimeError("MONGO_URI is not set. Please check your environment variables.")
    
    db.connect(app.config["MONGO_URI"], app.config["MONGO_DB_NAME"])
    app.db = db.get_db()

    # Register Blueprints
    register_routes(app)

    @app.route("/")
    def index():
        return {"status": "success", "message": "FLOWMIND API is running"}, 200

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        import os
        from flask import send_from_directory
        return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(
        host="0.0.0.0", 
        port=app.config["PORT"], 
        debug=app.config["DEBUG"]
    )
