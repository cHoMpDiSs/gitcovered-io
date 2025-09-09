# getcovered.io Assignment

A Flask application demonstrating Google OAuth integration with role-based access control.

## Features

- Google OAuth Authentication
- Role-based access control:
  - @getcovered.io emails → Admin Dashboard
  - All other emails → User Dashboard
- SQLite database for user profiles
- React frontend (in progress)

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

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create `.env` file with the following variables:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_secret_key
```

5. Run the application
```bash
flask run
```

## Project Structure

- `app.py`: Main Flask application with Google OAuth and role-based access
- `frontend/`: React frontend (in progress)
- `instance/`: SQLite database location

## Authentication Flow

1. User signs in with Google OAuth
2. Application verifies user's email domain:
   - @getcovered.io emails are directed to admin dashboard
   - All other emails are directed to user dashboard
3. User profile is stored in SQLite database

## Development

The project is built with:
- Flask (Backend)
- SQLite (Database)
- Authlib (OAuth)
- React (Frontend - in progress)