# Quickstart Guide: Frontend Completion & Secure API Integration

## Prerequisites

- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- PostgreSQL-compatible database (Neon Serverless PostgreSQL)
- Git for version control
- Package managers: npm/yarn for frontend, pip/poetry for backend

## Setup Instructions

### 1. Clone and Initialize Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend/

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend API URL
```

## Configuration

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
JWT_SECRET="your-super-secret-jwt-key-here"
BETTER_AUTH_SECRET="same-as-jwt-secret-for-consistency"
DEBUG=False
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
```

## Running the Application

### 1. Start Backend
```bash
cd backend/
source venv/bin/activate  # Activate virtual environment
uvicorn src.main:app --reload --port 8000
```

### 2. Start Frontend
```bash
cd frontend/
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs

## Security Features

### JWT Token Handling
- Tokens are stored in localStorage
- Automatically attached to all API requests
- Sessions are cleared on logout
- Expired tokens trigger automatic logout

### User Isolation
- Users can only access their own tasks
- Backend validates user ownership on all requests
- Unauthorized access attempts are rejected

### API Protection
- All endpoints require valid JWT tokens
- Invalid tokens result in 401 responses
- Malformed requests return appropriate error codes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/logout` - Logout current user

### Task Management
- `GET /api/tasks` - Get current user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## Testing

### Backend Tests
```bash
cd backend/
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend/
npm test
```

## Troubleshooting

### Common Issues
1. **Token Expiration**: Ensure JWT expiration time is appropriate
2. **CORS Errors**: Check backend CORS settings for frontend origin
3. **Authentication Failures**: Verify token is being sent in Authorization header
4. **UI State Issues**: Check that React Context is properly wrapped around app