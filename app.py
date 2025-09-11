from flask import Flask, redirect, url_for, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
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
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'demo-secret-key')

# Database configuration: prefer DATABASE_URL (Heroku Postgres), fallback to SQLite
database_url = os.getenv('DATABASE_URL', 'sqlite:////tmp/profiles.db')
# Heroku historically provides postgres://, SQLAlchemy expects postgresql://
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['JWT_ERROR_MESSAGE_KEY'] = 'error'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'
jwt = JWTManager(app)

@jwt.invalid_token_loader
def invalid_token_callback(error_string):
    print(f"Invalid token error: {error_string}")  # Debug logging
    return jsonify({
        'message': 'Invalid token',
        'error': str(error_string)
    }), 401

@jwt.unauthorized_loader
def missing_token_callback(error_string):
    print(f"Missing token error: {error_string}")  # Debug logging
    return jsonify({
        'message': 'Missing Authorization Header',
        'error': str(error_string)
    }), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    print(f"Expired token: {jwt_header}, {jwt_data}")  # Debug logging
    return jsonify({
        'message': 'Token has expired',
        'error': 'token_expired'
    }), 401

# Enable CORS with specific configuration for production
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
             "vary_header": True,
             "allow_credentials": True
         }
     },
     supports_credentials=True)

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
    # Password hashes from Werkzeug/pbkdf2 can exceed 100 chars on Postgres
    password = db.Column(db.String(255))
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
        
        # Check if user exists
        user = Profile.query.filter_by(email=email).first()
        # Enforce domain restriction for NEW signups only
        allowed_domains = (email.lower().endswith('@getcovered.io') or email.lower().endswith('@soberfriend.io'))
        if user is None and not allowed_domains:
            frontend_url = 'https://getcovered-io-d59e2aaeeb96.herokuapp.com' if os.getenv('FLASK_ENV') == 'production' else 'http://localhost:3000'
            return redirect(f'{frontend_url}/signin?error=domain_restricted')
        
        if user is None:
            user = Profile(
                full_name=full_name,
                email=email,
                avatar_img=avatar_img,
                last_login=datetime.utcnow()
            )
            db.session.add(user)
            db.session.commit()
        else:
            # Backfill name/avatar and update last_login for existing user
            updated = False
            if (not user.full_name) and full_name:
                user.full_name = full_name
                updated = True
            if (not user.avatar_img) and avatar_img:
                user.avatar_img = avatar_img
                updated = True
            user.last_login = datetime.utcnow()
            if updated:
                db.session.commit()
        
        # Create JWT token
        access_token = create_access_token(
            identity=email,
            additional_claims={
                'full_name': full_name,
                'avatar_img': avatar_img,
                'is_admin': email == 'admin@getcovered.io'
            }
        )
        
        # Redirect to frontend with token
        frontend_url = 'https://getcovered-io-d59e2aaeeb96.herokuapp.com' if os.getenv('FLASK_ENV') == 'production' else 'http://localhost:3000'
        return redirect(f'{frontend_url}/auth/callback?token={access_token}')
        
    except Exception as e:
        print("Authorization Error:", str(e))  # Debug print
        frontend_url = 'https://getcovered-io-d59e2aaeeb96.herokuapp.com' if os.getenv('FLASK_ENV') == 'production' else 'http://localhost:3000'
        return redirect(f'{frontend_url}/login?error=auth_failed')

@app.route('/api/dashboard')
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # If user is admin, redirect to admin dashboard
    if current_user == 'admin@getcovered.io':
        return jsonify({
            'redirect': '/admin/dashboard',
            'is_admin': True
        })
    
    return jsonify(
        full_name=user.full_name,
        email=user.email,
        avatar_img=user.avatar_img,
        is_admin=False
    )

@app.route('/api/admin/users')
@jwt_required()
def get_all_users():
    current_user = get_jwt_identity()
    if current_user != 'admin@getcovered.io':
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        users = Profile.query.all()
        users_data = [{
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'avatar_img': user.avatar_img,
            'is_admin': user.email == 'admin@getcovered.io',
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'last_login': user.last_login.isoformat() if user.last_login else None
        } for user in users]
        
        return jsonify({
            'users': users_data,
            'total_users': len(users_data)
        })
    except Exception as e:
        return jsonify({'error': 'Failed to fetch users'}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_user(user_id):
    if request.method == 'OPTIONS':
        return '', 200

    current_user = get_jwt_identity()
    # Only allow specific admin user
    if current_user != 'admin@getcovered.io':
        return jsonify({'error': 'Unauthorized'}), 403

    user = Profile.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Prevent deleting own account to avoid accidental lockout
    if user.email == current_user:
        return jsonify({'error': 'You cannot delete your own account'}), 400

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete user'}), 500

@app.route('/api/account', methods=['DELETE', 'OPTIONS'], strict_slashes=False)
@jwt_required()
def delete_my_account():
    if request.method == 'OPTIONS':
        return '', 200

    current_user = get_jwt_identity()
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Account deleted successfully'}), 200
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete account'}), 500

@app.route('/api/admin/dashboard')
@jwt_required()
def admin_dashboard():
    current_user = get_jwt_identity()
    if current_user != 'admin@getcovered.io':
        return jsonify({
            'redirect': '/dashboard',
            'error': 'Unauthorized access'
        })
    
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(
        full_name=user.full_name,
        email=user.email,
        avatar_img=user.avatar_img,
        is_admin=True
    )

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    full_name = (data.get('full_name') or '').strip()

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

    # Enforce domain restriction for email signups (allow getcovered.io and soberfriend.io)
    if not (email.lower().endswith('@getcovered.io') or email.lower().endswith('@soberfriend.io')):
        return jsonify({'error': 'Signups are restricted to getcovered.io or soberfriend.io emails'}), 403

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
                'is_admin': email == 'admin@getcovered.io'
            }
        )
        
        return jsonify({
            'message': 'Account created successfully! Welcome to GetCovered.io',
            'token': access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Something went wrong while creating your account. Please try again'}), 500

@app.route('/api/login/password', methods=['POST', 'OPTIONS'])
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
            'is_admin': email == 'admin@getcovered.io'
        }
    )

    return jsonify({
        'message': 'Welcome back!',
        'token': access_token
    })

@app.route('/api/profile', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_profile():
    if request.method == 'OPTIONS':
        return '', 200

    current_user = get_jwt_identity()
    user = Profile.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    # Force email to remain unchanged; ignore client-provided email
    new_email = get_jwt_identity()
    new_name = data.get('full_name')
    new_avatar = (data.get('avatar_img') or '').strip()

    # Allow partial updates; full name is optional

    # Keep email unchanged; do not allow email updates
    if new_email != current_user:
        return jsonify({'error': 'Email updates are not allowed'}), 403

    # Validate avatar URL if provided
    if new_avatar:
        lower_avatar = new_avatar.lower()
        if not (lower_avatar.startswith('http://') or lower_avatar.startswith('https://')):
            return jsonify({'error': 'Avatar URL must start with http:// or https://'}), 400

    # Skip duplicate email checks since email cannot be changed

    try:
        user.email = new_email
        if new_name:
            user.full_name = new_name
        if new_avatar:
            user.avatar_img = new_avatar
        db.session.commit()

        # Create new JWT with updated information
        access_token = create_access_token(
            identity=new_email,
            additional_claims={
                'full_name': user.full_name,
                'avatar_img': user.avatar_img,
                'is_admin': new_email == 'admin@getcovered.io'
            }
        )

        return jsonify({
            'message': 'Profile updated successfully',
            'token': access_token
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500

@app.route('/api/auth/status')
@jwt_required()
def auth_status():
    current_user = get_jwt_identity()
    return jsonify({
        'authenticated': True,
        'is_admin': current_user == 'admin@getcovered.io'
    })

# Create tables on startup
def init_db():
    with app.app_context():
        try:
            # Create tables if they do not exist (idempotent)
            db.create_all()
            # On Postgres, widen password column if needed (from VARCHAR(100) to 255)
            try:
                if app.config['SQLALCHEMY_DATABASE_URI'].startswith('postgresql://'):
                    with db.engine.begin() as conn:
                        conn.execute(text("ALTER TABLE profile ALTER COLUMN password TYPE VARCHAR(255)"))
            except Exception as e:
                # Ignore if already widened or table doesn't exist yet
                pass
        except Exception as e:
            print(f"Database initialization error: {e}")

# Add security headers to all responses
@app.after_request
def add_security_headers(response):
    origin = request.headers.get('Origin')
    if origin in ["http://localhost:3000", "https://getcovered-io-d59e2aaeeb96.herokuapp.com"]:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        if request.method == 'OPTIONS':
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin'
    return response

# Ensure tables exist (safe in all envs; does not drop data)
init_db()

if __name__ == '__main__':
    app.run(debug=True)