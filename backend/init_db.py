import os
from sqlmodel import SQLModel
from src.database import engine
from src.models.user import User
from src.models.task import Task

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    # Create the directory for the SQLite database if it doesn't exist
    db_path = "./todo_app.db"
    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True) if os.path.dirname(db_path) else None
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()