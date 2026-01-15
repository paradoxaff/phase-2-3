from sqlmodel import Session, select
from typing import List, Optional
import uuid

from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User


def create_task(session: Session, task_create: TaskCreate, user_id: uuid.UUID) -> Task:
    db_task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=task_create.completed,
        user_id=user_id
    )
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


def get_tasks(session: Session, user_id: uuid.UUID, completed: Optional[bool] = None) -> List[Task]:
    query = select(Task).where(Task.user_id == user_id)

    if completed is not None:
        query = query.where(Task.completed == completed)

    tasks = session.exec(query).all()
    return tasks


def get_task(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()
    return task


def update_task(session: Session, task_id: uuid.UUID, task_update: TaskUpdate, user_id: uuid.UUID) -> Optional[Task]:
    db_task = get_task(session, task_id, user_id)
    if db_task:
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_task, field, value)
        db_task.updated_at = task_update.updated_at if hasattr(task_update, 'updated_at') else task_update.__dict__.get('updated_at', db_task.updated_at)
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
    return db_task


def delete_task(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    db_task = get_task(session, task_id, user_id)
    if db_task:
        session.delete(db_task)
        session.commit()
        return True
    return False


def toggle_task_completion(session: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
    db_task = get_task(session, task_id, user_id)
    if db_task:
        db_task.completed = not db_task.completed
        db_task.updated_at = db_task.updated_at  # This will update the timestamp
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
    return db_task