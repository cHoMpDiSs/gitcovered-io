from flask import Flask, redirect, url_for, session, request, jsonify
from authlib.integrations.flask_client import OAuth
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///profiles.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# OAuth 2 client setup
oauth = OAuth(app)

if not os.getenv('GOOGLE_CLIENT_ID') or not os.getenv('GOOGLE_CLIENT_SECRET'):
    raise ValueError("Google OAuth credentials not found in environment variables!")

google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile',
        'prompt': 'select_account'
    }
)

db = SQLAlchemy(app)

class Profile(db.Model):
    __tablename__ = 'profile'  # Explicitly set the table name
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
    redirect_uri = url_for('authorized', _external=True)
    print("Login Redirect URI:", redirect_uri)  # Debug print
    print("Using Client ID:", os.getenv('GOOGLE_CLIENT_ID'))  # Debug print
    return google.authorize_redirect(redirect_uri)

@app.route('/logout')
def logout():
    session.pop('google_token', None)
    session.pop('email', None)
    return redirect(url_for('index'))

@app.route('/login/authorized')
def authorized():
    try:
        token = google.authorize_access_token()
        print("Received token:", bool(token))  # Debug print
        
        resp = google.get('https://openidconnect.googleapis.com/v1/userinfo')
        user_info = resp.json()
        print("User info:", user_info)  # Debug print
        email = user_info['email']
        full_name = user_info['name']
        avatar_img = user_info['picture']
        
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
        
        session['email'] = email
        
        # Redirect based on email domain
        if email.endswith('@getcovered.io'):
            return redirect(url_for('admin_dashboard'))
        return redirect(url_for('dashboard'))
        
    except Exception as e:
        print("Authorization Error:", str(e))  # Debug print
        return f"Authorization failed: {str(e)}"

@app.route('/dashboard')
def dashboard():
    if 'email' not in session:
        return redirect(url_for('login'))
    user = Profile.query.filter_by(email=session['email']).first()
    return jsonify(full_name=user.full_name, email=user.email, avatar_img=user.avatar_img)

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'email' not in session or not session['email'].endswith('@getcovered.io'):
        return redirect(url_for('dashboard'))
    return 'Welcome to the admin dashboard!'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables within app context
    app.run(debug=True)