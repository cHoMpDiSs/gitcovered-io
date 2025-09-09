from flask import Flask, redirect, url_for, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import os
from dotenv import load_dotenv
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
from google.auth.transport import requests
import pathlib
import json
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash

# Load environment variables from .env file
load_dotenv()

# This is required for Google OAuth to work with HTTP in development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__, static_folder='frontend/build/static', static_url_path='/static')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/profiles.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Enable CORS
CORS(app, 
     resources={
         r"/*": {
             "origins": [
                "http://localhost:3000",
                "https://getcovered-io-d59e2aaeeb96.herokuapp.com",
                os.getenv('FRONTEND_URL', '')
             ],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
             "supports_credentials": True,
             "expose_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
             "max_age": 600,
             "send_wildcard": False,
             "vary_header": True
         }
     })

# OAuth 2 client setup
CLIENT_SECRETS_FILE = "client_secrets.json"

# Create client_secrets.json if it doesn't exist
if not os.path.exists(CLIENT_SECRETS_FILE):
    client_config = {
        "web": {
            "client_id": os.getenv('GOOGLE_CLIENT_ID'),
            "client_secret": os.getenv('GOOGLE_CLIENT_SECRET'),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [
                "http://127.0.0.1:5000/login/authorized",
                "https://getcovered-io-d59e2aaeeb96.herokuapp.com/login/authorized"
            ],
            "javascript_origins": [
                "http://localhost:3000",
                "http://127.0.0.1:5000",
                "https://getcovered-io-d59e2aaeeb96.herokuapp.com"
            ]
        }
    }
    with open(CLIENT_SECRETS_FILE, 'w') as f:
        json.dump(client_config, f)

# OAuth2 Flow
redirect_uri = 'https://getcovered-io-d59e2aaeeb96.herokuapp.com/login/authorized' if os.getenv('FLASK_ENV') == 'production' else 'http://127.0.0.1:5000/login/authorized'

flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    redirect_uri=redirect_uri
)

db = SQLAlchemy(app)

from datetime import datetime

class Profile(db.Model):
    __tablename__ = 'profile'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    avatar_img = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith("static/"):
        return app.send_static_file(path[7:])
    elif path != "" and os.path.exists(os.path.join('frontend', 'build', path)):
        return send_from_directory('frontend/build', path)
    return send_from_directory('frontend/build', 'index.html')

@app.route('/login')
def login():
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    print("Redirecting to:", authorization_url)  # Debug print
    return redirect(authorization_url)

@app.route('/login/authorized')
def authorized():
    try:
        print("Received callback with URL:", request.url)  # Debug print
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials
        
        id_info = id_token.verify_oauth2_token(
            credentials.id_token, requests.Request(), os.getenv('GOOGLE_CLIENT_ID')
        )
        print("Received user info:", id_info)  # Debug print
        
        email = id_info['email']
        full_name = id_info['name']
        avatar_img = id_info.get('picture', '')
        
        # Check if user exists, if not, create a new user
        user = Profile.query.filter_by(email=email).first()
        if user is None:
            user = Profile(
                full_name=full_name,
                email=email,
                avatar_img=avatar_img,
                last_login=datetime.utcnow()
            )
            db.session.add(user)
            db.session.commit()
        
        # Create JWT token
        access_token = create_access_token(
            identity=email,
            additional_claims={
                'full_name': full_name,
                'avatar_img': avatar_img,
                'is_admin': email.endswith('@getcovered.io') or email == 'jordon@soberfriend.io'
            }
        )
        
        # Redirect to frontend with token
        frontend_url = 'https://getcovered-io-d59e2aaeeb96.herokuapp.com' if os.getenv('FLASK_ENV') == 'production' else 'http://localhost:3000'
        return redirect(f'{frontend_url}/auth/callback?token={access_token}')
        
    except Exception as e:
        print("Authorization Error:", str(e))  # Debug print
        frontend_url = 'https://getcovered-io-d59e2aaeeb96.herokuapp.com' if os.getenv('FLASK_ENV') == 'production' else 'http://localhost:3000'
        return redirect(f'{frontend_url}/login?error=auth_failed')

@app.route('/dashboard')
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(full_name=user.full_name, email=user.email, avatar_img=user.avatar_img)

@app.route('/admin/users')
@jwt_required()
def get_all_users():
    current_user = get_jwt_identity()
    if not current_user.endswith('@getcovered.io') or current_user == 'jordon@soberfriend.io':
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        users = Profile.query.all()
        users_data = [{
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'avatar_img': user.avatar_img,
            'is_admin': user.email.endswith('@getcovered.io') or user.email == 'jordon@soberfriend.io',
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'last_login': user.last_login.isoformat() if user.last_login else None
        } for user in users]
        
        return jsonify({
            'users': users_data,
            'total_users': len(users_data)
        })
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@app.route('/admin/dashboard')
@jwt_required()
def admin_dashboard():
    current_user = get_jwt_identity()
    if not (current_user.endswith('@getcovered.io') or current_user == 'jordon@soberfriend.io'):
        return jsonify({'error': 'Unauthorized'}), 403
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(full_name=user.full_name, email=user.email, avatar_img=user.avatar_img)

@app.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')

    # Validate required fields
    if not email:
        return jsonify({'error': 'Please enter your email address'}), 400
    if not password:
        return jsonify({'error': 'Please enter a password'}), 400
    if not full_name:
        return jsonify({'error': 'Please enter your full name'}), 400

    # Validate email format
    if '@' not in email or '.' not in email:
        return jsonify({'error': 'Please enter a valid email address'}), 400

    # Validate password strength
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400

    # Check if user already exists
    if Profile.query.filter_by(email=email).first():
        return jsonify({'error': 'This email is already registered. Please sign in or use a different email'}), 409

    # Create new user
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = Profile(
        email=email,
        password=hashed_password,
        full_name=full_name
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()

        # Create JWT token
        access_token = create_access_token(
            identity=email,
            additional_claims={
                'full_name': full_name,
                'is_admin': email.endswith('@getcovered.io') or email == 'jordon@soberfriend.io'
            }
        )
        
        return jsonify({
            'message': 'Account created successfully! Welcome to GetCovered.io',
            'token': access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Something went wrong while creating your account. Please try again'}), 500

@app.route('/login/password', methods=['POST', 'OPTIONS'])
def login_with_password():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validate required fields
    if not email:
        return jsonify({'error': 'Please enter your email address'}), 400
    if not password:
        return jsonify({'error': 'Please enter your password'}), 400

    # Find user and check password
    user = Profile.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'No account found with this email. Please sign up first'}), 401
    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Incorrect password. Please try again'}), 401

    user.last_login = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(
        identity=email,
        additional_claims={
            'full_name': user.full_name,
            'avatar_img': user.avatar_img,
            'is_admin': email.endswith('@getcovered.io') or email == 'jordon@soberfriend.io'
        }
    )

    return jsonify({
        'message': 'Welcome back!',
        'token': access_token
    })

@app.route('/profile', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_profile():
    if request.method == 'OPTIONS':
        return '', 200

    current_user = get_jwt_identity()
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    new_email = data.get('email')
    new_name = data.get('full_name')

    if not new_email or not new_name:
        return jsonify({'error': 'Email and full name are required'}), 400

    # Validate email format
    if '@' not in new_email or '.' not in new_email:
        return jsonify({'error': 'Please enter a valid email address'}), 400

    # Check if new email is already taken by another user
    if new_email != current_user:
        existing_user = Profile.query.filter_by(email=new_email).first()
        if existing_user:
            return jsonify({'error': 'This email is already registered'}), 409

    try:
        user.email = new_email
        user.full_name = new_name
        db.session.commit()

        # Create new JWT with updated information
        access_token = create_access_token(
            identity=new_email,
            additional_claims={
                'full_name': new_name,
                'avatar_img': user.avatar_img,
                'is_admin': new_email.endswith('@getcovered.io')
            }
        )

        return jsonify({
            'message': 'Profile updated successfully',
            'token': access_token
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500

@app.route('/auth/status')
@jwt_required()
def auth_status():
    current_user = get_jwt_identity()
    return jsonify({
        'authenticated': True,
        'is_admin': current_user.endswith('@getcovered.io') or current_user == 'jordon@soberfriend.io'
    })

# Create tables on startup
def init_db():
    with app.app_context():
        try:
            # Drop all tables first
            db.drop_all()
            # Then create them again
            db.create_all()
        except Exception as e:
            print(f"Database initialization error: {e}")

# Add security headers to all responses
@app.after_request
def add_security_headers(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
    return response

init_db()

if __name__ == '__main__':
    app.run(debug=True)