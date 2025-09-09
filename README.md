# getcovered.io Assignment

A Flask application demonstrating Google OAuth integration with JWT-based role-based access control.

## Features

- Google OAuth Authentication
- JWT-based Authentication
- Role-based access control:
  - @getcovered.io emails → Admin Dashboard
  - All other emails → User Dashboard
- SQLite database for user profiles
- React frontend with TypeScript

## Tech Stack

### Backend
- Flask
- SQLAlchemy (SQLite)
- Flask-JWT-Extended
- Google OAuth2
- Python 3.x

### Frontend
- React with TypeScript
- React Router
- Axios for API calls
- JWT Authentication

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd getcovered-io-assignment
```

2. Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install backend dependencies
```bash
pip install -r requirements.txt
```

4. Create `.env` file with the following variables:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
```

5. Install frontend dependencies
```bash
cd frontend
npm install
```

6. Run the application
```bash
# Terminal 1 - Backend
flask run

# Terminal 2 - Frontend
cd frontend
npm start
```

## Authentication Flow

1. User clicks "Sign in with Google"
2. Google OAuth handles authentication
3. Backend verifies user and creates JWT token
4. Frontend stores JWT token
5. JWT token used for subsequent API calls
6. Role-based access based on email domain:
   - @getcovered.io emails get admin access
   - All other emails get regular user access

## API Endpoints

- `/login` - Initiates Google OAuth flow
- `/login/authorized` - OAuth callback, returns JWT
- `/dashboard` - User dashboard (JWT required)
- `/admin/dashboard` - Admin dashboard (JWT required)
- `/auth/status` - Check authentication status

## Development

The project uses:
- TypeScript for type safety
- JWT for secure authentication
- SQLite for data storage
- Google OAuth for authentication
- React for frontend UI