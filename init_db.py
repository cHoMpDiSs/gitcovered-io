from app import app, db, Profile
from datetime import datetime
from werkzeug.security import generate_password_hash

with app.app_context():
    # Drop all existing tables and recreate them
    db.drop_all()
    db.create_all()

    # Create initial admin user
    admin = Profile(
        full_name='Admin User',
        email='admin@getcovered.io',
        password=generate_password_hash('password123', method='pbkdf2:sha256'),
        avatar_img='https://ui-avatars.com/api/?name=Admin+User',
        created_at=datetime.utcnow(),
        last_login=datetime.utcnow()
    )
    db.session.add(admin)
    db.session.commit()

    print("Database tables created successfully with initial admin user!")