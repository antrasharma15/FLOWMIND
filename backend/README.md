# FlowMind Backend 🧠

A professional Flask-based backend for the FlowMind task management platform.

## 📁 Project Structure

```text
backend/
├── app.py              # Main entry point & runner
├── config.py           # Configuration management
├── database.py         # MongoDB connection & client
├── requirements.txt    # Project dependencies
├── .env                # Environment variables (private)
├── routes/             # API Route Blueprints
│   ├── __init__.py     # Blueprint registration
│   ├── health.py       # Health checks
│   └── users.py        # User management
└── models/             # Data models (to be implemented)
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Setup
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Fill in your `MONGO_URI` and `MONGO_DB_NAME`.

### 3. Run the Server
```bash
python app.py
```

## 🔌 API Endpoints
- **Root**: `GET /` - Basic status check
- **Health**: `GET /health` - Detailed health check
