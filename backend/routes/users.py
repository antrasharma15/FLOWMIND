from flask import Blueprint, current_app, request, jsonify
from bson.objectid import ObjectId
from utils.auth import hash_password, check_password, generate_token, token_required
from datetime import datetime

users_bp = Blueprint("users", __name__, url_prefix="/api/user")

@users_bp.post("/signup")
def signup():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        print(f"Signup attempt for email: {email}")
        
        if not email or not password:
            print("Signup failed: Email or password missing")
            return jsonify({'error': 'Email and password are required'}), 400

        # Check if user exists
        existing_user = current_app.db.users.find_one({'email': email})
        if existing_user:
            print(f"Signup failed: User {email} already exists")
            return jsonify({'error': 'User already exists'}), 400

        user_data = {
            'name': data.get('name', email.split('@')[0]),
            'email': email,
            'password': hash_password(password),
            'created_at': datetime.utcnow()
        }

        result = current_app.db.users.insert_one(user_data)
        token = generate_token(result.inserted_id)

        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'id': str(result.inserted_id),
                'email': user_data['email'],
                'name': user_data['name'],
                'avatar': user_data.get('avatar')
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.post("/login")
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        print(f"Login attempt for email: {email}")
        
        if not email or not password:
            print("Login failed: Email or password missing")
            return jsonify({'error': 'Email and password are required'}), 400

        user = current_app.db.users.find_one({'email': email})
        if not user:
            print(f"Login failed: User {email} not found")
            return jsonify({'error': 'Invalid credentials'}), 401
            
        print(f"User found: {user['email']}. Checking password...")
        is_password_correct = check_password(password, user['password'])
        print(f"Password check result: {is_password_correct}")
        
        if not is_password_correct:
            return jsonify({'error': 'Invalid credentials'}), 401

        token = generate_token(user['_id'])

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'avatar': user.get('avatar')
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.get("/profile")
@token_required
def get_profile(current_user_id):
    """Fetch the current user's profile and settings."""
    try:
        user = current_app.db.users.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'name': user.get('name'),
            'email': user.get('email'),
            'avatar': user.get('avatar'),
            'aiPreference': user.get('aiPreference', 'Balanced'),
            'uiDensity': user.get('uiDensity', 'Balanced'),
            'settings': user.get('settings', {
                'theme': 'dark',
                'ai_intensity': 'balanced',
                'notifications': True
            })
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.patch("/settings")
@token_required
def update_settings(current_user_id):
    """Update user settings in MongoDB."""
    try:
        data = request.get_json()
        # Filter data to only include name and settings fields
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'settings' in data:
            update_data['settings'] = data['settings']
            
        current_app.db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": update_data}
        )
        return jsonify({'message': 'Settings updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.put("/profile")
@token_required
def update_profile(current_user_id):
    """Update user profile (e.g., name and settings)."""
    try:
        data = request.get_json()
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'uiDensity' in data:
            update_data['uiDensity'] = data['uiDensity']
        if 'settings' in data:
            update_data['settings'] = data['settings']
            
        if not update_data:
            return jsonify({'message': 'No data to update'}), 400
            
        current_app.db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": update_data}
        )
        return jsonify({'message': 'Profile and settings updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.put("/ai-preferences")
@token_required
def update_ai_preferences(current_user_id):
    """Update AI behavior mode in MongoDB."""
    try:
        data = request.get_json()
        ai_preference = data.get('aiPreference')
        
        if not ai_preference:
            return jsonify({'error': 'aiPreference is required'}), 400
            
        if ai_preference not in ['Focused', 'Balanced', 'Relaxed']:
            return jsonify({'error': 'Invalid AI preference mode'}), 400
            
        current_app.db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"aiPreference": ai_preference}}
        )
        return jsonify({'message': 'AI preferences updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.delete("/account")
@token_required
def delete_account(current_user_id):
    """Permanently delete user account and all associated data."""
    try:
        # 1. Delete user tasks
        current_app.db.tasks.delete_many({"user_id": current_user_id})
        
        # 2. Delete user account
        result = current_app.db.users.delete_one({"_id": ObjectId(current_user_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({'message': 'Account and all associated data deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.post("/upload-avatar")
@token_required
def upload_avatar(current_user_id):
    """Upload and update user profile avatar."""
    try:
        import os
        from werkzeug.utils import secure_filename
        
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        if file:
            filename = secure_filename(f"{current_user_id}_{file.filename}")
            upload_folder = os.path.join(current_app.root_path, 'uploads', 'avatars')
            
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
                
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            
            # Generate URL for the avatar
            avatar_url = f"/uploads/avatars/{filename}"
            
            # Update MongoDB
            current_app.db.users.update_one(
                {"_id": ObjectId(current_user_id)},
                {"$set": {"avatar": avatar_url}}
            )
            
            return jsonify({
                'message': 'Avatar uploaded successfully',
                'avatar': avatar_url
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.delete("/remove-avatar")
@token_required
def remove_avatar(current_user_id):
    """Remove the user profile avatar."""
    try:
        current_app.db.users.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"avatar": None}}
        )
        return jsonify({'message': 'Avatar removed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
