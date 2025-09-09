from flask import Flask, redirect, url_for, request, jsonify
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

# Load environment variables from .env file
load_dotenv()

# This is required for Google OAuth to work with HTTP in development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///profiles.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Enable CORS
CORS(app, 
     resources={
         r"/*": {
             "origins": ["http://localhost:3000"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
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
            "redirect_uris": ["http://127.0.0.1:5000/login/authorized"],
            "javascript_origins": ["http://localhost:3000", "http://127.0.0.1:5000"]
        }
    }
    with open(CLIENT_SECRETS_FILE, 'w') as f:
        json.dump(client_config, f)

# OAuth2 Flow
flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    redirect_uri='http://127.0.0.1:5000/login/authorized'
)

db = SQLAlchemy(app)

class Profile(db.Model):
    __tablename__ = 'profile'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    avatar_img = db.Column(db.String(200))

@app.route('/')
def index():
    return 'Welcome to the Flask App with Google OAuth!'

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
                avatar_img=avatar_img
            )
            db.session.add(user)
            db.session.commit()
        
        # Create JWT token
        access_token = create_access_token(
            identity=email,
            additional_claims={
                'full_name': full_name,
                'avatar_img': avatar_img,
                'is_admin': email.endswith('@getcovered.io')
            }
        )
        
        # Redirect to frontend with token
        return redirect(f'http://localhost:3000/auth/callback?token={access_token}')
        
    except Exception as e:
        print("Authorization Error:", str(e))  # Debug print
        return redirect('http://localhost:3000/login?error=auth_failed')

@app.route('/dashboard')
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(full_name=user.full_name, email=user.email, avatar_img=user.avatar_img)

@app.route('/admin/dashboard')
@jwt_required()
def admin_dashboard():
    current_user = get_jwt_identity()
    if not current_user.endswith('@getcovered.io'):
        return jsonify({'error': 'Unauthorized'}), 403
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(full_name=user.full_name, email=user.email, avatar_img=user.avatar_img)

@app.route('/auth/status')
@jwt_required()
def auth_status():
    current_user = get_jwt_identity()
    return jsonify({
        'authenticated': True,
        'is_admin': current_user.endswith('@getcovered.io')
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)