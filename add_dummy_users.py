from app import app, db, Profile
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

dummy_users = [
    {
        'full_name': 'John Smith',
        'email': 'john.smith@example.com',
        'avatar_img': 'https://ui-avatars.com/api/?name=John+Smith'
    },
    {
        'full_name': 'Sarah Johnson',
        'email': 'sarah.j@example.com',
        'avatar_img': 'https://ui-avatars.com/api/?name=Sarah+Johnson'
    },
    {
        'full_name': 'Michael Chen',
        'email': 'mchen@example.com',
        'avatar_img': 'https://ui-avatars.com/api/?name=Michael+Chen'
    },
    {
        'full_name': 'Emily Brown',
        'email': 'emily.brown@example.com',
        'avatar_img': 'https://ui-avatars.com/api/?name=Emily+Brown'
    },
    {
        'full_name': 'David Wilson',
        'email': 'david.w@example.com',
        'avatar_img': 'https://ui-avatars.com/api/?name=David+Wilson'
    },
    {
        'full_name': 'Lisa Anderson',
        'email': 'lisa.a@example.com',
        'avatar_img': 'https://ui-avatars.com/api/?name=Lisa+Anderson'
    },
    {
        'full_name': 'James Taylor',
        'email': 'jtaylor@example.com',
        'avatar_img': 'https://ui-avatars.com/api/?name=James+Taylor'
    },
 
    {
        'full_name': 'Test User',
        'email': 'test@getcovered.io',
        'avatar_img': 'https://ui-avatars.com/api/?name=Test+User'
    }
]

def create_dummy_users():
    with app.app_context():
        # Get current time for reference
        now = datetime.utcnow()
        
        for user_data in dummy_users:
            # Check if user already exists
            if not Profile.query.filter_by(email=user_data['email']).first():
                # Generate random dates within the last 30 days
                days_ago = random.randint(1, 30)
                created_at = now - timedelta(days=days_ago)
                
                # Some users might not have logged in since creation
                has_logged_in = random.choice([True, True, False])  # 2/3 chance of having logged in
                last_login = now - timedelta(days=random.randint(0, days_ago)) if has_logged_in else None
                
                # Create new user
                new_user = Profile(
                    full_name=user_data['full_name'],
                    email=user_data['email'],
                    password=generate_password_hash('password123', method='pbkdf2:sha256'),
                    avatar_img=user_data['avatar_img'],
                    created_at=created_at,
                    last_login=last_login
                )
                db.session.add(new_user)
                print(f"Added user: {user_data['full_name']}")
        
        db.session.commit()
        print("\nDummy users have been added successfully!")

if __name__ == '__main__':
    create_dummy_users()
