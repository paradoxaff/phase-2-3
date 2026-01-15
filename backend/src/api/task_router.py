from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid

from ..database import get_session
from ..middleware.auth_middleware import get_current_user
from ..models.user import User
from ..models.task import Task, TaskCreate, TaskRead, TaskUpdate
from ..services.task_service import (
    create_task, get_tasks, get_task, update_task, delete_task, toggle_task_completion
)

router = APIRouter()

@router.get("/tasks", response_model=Dict[str, Any])
def read_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    completed: bool = None
):
    tasks = get_tasks(session, current_user.id, completed)
    task_list = [
        TaskRead(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]
    return {
        "success": True,
        "data": {
            "tasks": task_list,
            "pagination": {
                "limit": len(task_list),
                "offset": 0,
                "total": len(task_list)
            }
        }
    }


@router.post("/tasks", response_model=Dict[str, Any])
def create_new_task(
    task_create: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_task = create_task(session, task_create, current_user.id)
    return {
        "success": True,
        "data": {
            "task": TaskRead(
                id=db_task.id,
                title=db_task.title,
                description=db_task.description,
                completed=db_task.completed,
                user_id=db_task.user_id,
                created_at=db_task.created_at,
                updated_at=db_task.updated_at
            )
        }
    }


@router.get("/tasks/{task_id}", response_model=Dict[str, Any])
def read_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    db_task = get_task(session, task_uuid, current_user.id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {
        "success": True,
        "data": {
            "task": TaskRead(
                id=db_task.id,
                title=db_task.title,
                description=db_task.description,
                completed=db_task.completed,
                user_id=db_task.user_id,
                created_at=db_task.created_at,
                updated_at=db_task.updated_at
            )
        }
    }


@router.put("/tasks/{task_id}", response_model=Dict[str, Any])
def update_existing_task(
    task_id: str,
    task_update: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    db_task = update_task(session, task_uuid, task_update, current_user.id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {
        "success": True,
        "data": {
            "task": TaskRead(
                id=db_task.id,
                title=db_task.title,
                description=db_task.description,
                completed=db_task.completed,
                user_id=db_task.user_id,
                created_at=db_task.created_at,
                updated_at=db_task.updated_at
            )
        }
    }


@router.delete("/tasks/{task_id}")
def delete_existing_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    success = delete_task(session, task_uuid, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {
        "success": True,
        "message": "Task deleted successfully"
    }


@router.patch("/tasks/{task_id}/complete", response_model=Dict[str, Any])
def toggle_task_completion_status(
    task_id: str,
    completed: bool,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    db_task = toggle_task_completion(session, task_uuid, current_user.id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {
        "success": True,
        "data": {
            "task": TaskRead(
                id=db_task.id,
                title=db_task.title,
                description=db_task.description,
                completed=db_task.completed,
                user_id=db_task.user_id,
                created_at=db_task.created_at,
                updated_at=db_task.updated_at
            )
        }
    }