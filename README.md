# Todo Full-Stack Web Application

A secure, multi-user todo application with authentication and user-isolated task management.

## Features

- User registration and authentication
- Secure JWT-based authentication
- Create, read, update, and delete tasks
- Task completion toggling
- User-isolated data (users can only access their own tasks)
- Responsive web interface

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: SQLModel
- **Authentication**: JWT with bcrypt hashing
- **Dependencies**: See `backend/requirements.txt`

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: CSS Modules/Globals
- **State Management**: React Context API
- **Dependencies**: See `frontend/package.json`

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL-compatible database (Neon Serverless recommended)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and set your database URL and JWT secret:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
   JWT_SECRET=your-super-secret-jwt-key-here
   BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
   DEBUG=False
   ```

5. Run the application:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Edit the `.env.local` file and set your backend API URL:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/logout` - Logout current user

### Task Management
- `GET /api/tasks` - Get current user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## Security Features

- JWT authentication required for all task endpoints
- User isolation - users can only access their own tasks
- Passwords are hashed using bcrypt
- Input validation and sanitization
- All endpoints enforce proper HTTP status codes (401, 403, 404)
- User ID validation ensures ownership before access

## Authentication Flow (JWT)

The application implements a secure JWT-based authentication flow:
1. User registers/logs in via authentication endpoints
2. Server generates JWT token with user ID in payload
3. Token is returned to frontend and stored in localStorage
4. Frontend automatically attaches token to all API requests via Authorization header
5. Backend middleware verifies token authenticity and extracts user ID
6. Service layer validates that user ID matches resource ownership
7. Unauthorized requests receive appropriate HTTP status codes

## Development

### Running Both Servers

1. Terminal 1 (Backend):
   ```bash
   cd backend
   uvicorn src.main:app --reload --port 8000
   ```

2. Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## Project Structure

```
backend/
├── src/
│   ├── models/     # SQLModel database models
│   ├── services/   # Business logic
│   ├── api/        # API routes
│   ├── middleware/ # Authentication middleware
│   └── main.py     # Application entry point
├── requirements.txt
└── .env

frontend/
├── src/
│   ├── app/        # Next.js App Router pages
│   ├── components/ # React components
│   ├── services/   # API and auth services
│   └── types/      # TypeScript types
├── package.json
└── .env.local
```

## Configuration

The application uses environment variables for configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `BETTER_AUTH_SECRET`: Secret key for authentication (should match JWT_SECRET)
- `NEXT_PUBLIC_API_BASE_URL`: Frontend variable for backend API base URL

Example configuration files are provided as `.env.example` and `.env.local.example`.

## License

This project is licensed under the MIT License.