import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
ENV_EXAMPLE_PATH = os.path.join(BASE_DIR, ".env.example")

load_dotenv(ENV_PATH)
if not os.getenv("GEMINI_API_KEY"):
    load_dotenv(ENV_EXAMPLE_PATH)

gemini_key = os.getenv("GEMINI_API_KEY")
print(f"GEMINI_API_KEY loaded: {bool(gemini_key)}")
if gemini_key:
    print(f"GEMINI_API_KEY length: {len(gemini_key)}")

class Config:
    """Base configuration class."""
    SECRET_KEY = os.getenv("SECRET_KEY", "flowmind-default-secret-key")
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    PORT = int(os.getenv("PORT", "5000"))
    
    # MongoDB Configuration
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "FlowMind")
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

    # AI Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
