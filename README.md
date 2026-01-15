# Todo Application

A full-stack web application for managing tasks with user authentication.

## Features

- User registration and login
- Create, read, update, and delete tasks
- User isolation (users can only see their own tasks)
- JWT-based authentication

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 14 (TypeScript/React)
- **Database**: SQLite (can be configured to use PostgreSQL)
- **Authentication**: JWT-based authentication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/paradoxaff/Todo-app.git
```

2. Navigate to the project directory:
```bash
cd Todo-app
```

3. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

5. Configure environment variables in both backend and frontend directories (copy .env.example to .env and update values)

6. Start the backend server:
```bash
cd backend
python main.py
```

7. Start the frontend server:
```bash
cd frontend
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Register for a new account or log in if you already have an account
3. Start creating and managing your tasks

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Log in an existing user
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task for the authenticated user
- `PUT /api/tasks/{id}` - Update a task for the authenticated user
- `DELETE /api/tasks/{id}` - Delete a task for the authenticated user

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.