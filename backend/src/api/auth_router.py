from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Dict, Any

from ..database import get_session
from ..models.user import UserCreate, UserRead
from ..services.auth import authenticate_user, create_user, create_access_token
from ..config import settings

router = APIRouter()

@router.post("/auth/register", response_model=Dict[str, Any])
def register(user_create: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    from sqlmodel import select
    from ..models.user import User

    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create new user
    db_user = create_user(session, user_create)

    # Create access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )

    return {
        "success": True,
        "data": {
            "user": UserRead(
                id=db_user.id,
                email=db_user.email,
                created_at=db_user.created_at
            ),
            "token": access_token
        }
    }


@router.post("/auth/login", response_model=Dict[str, Any])
def login(email: str, password: str, session: Session = Depends(get_session)):
    user = authenticate_user(session, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    from datetime import timedelta
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )

    return {
        "success": True,
        "data": {
            "user": UserRead(
                id=user.id,
                email=user.email,
                created_at=user.created_at
            ),
            "token": access_token
        }
    }


@router.post("/auth/logout")
def logout():
    # In a stateless JWT system, logout is typically handled on the client side
    # by removing the token. This endpoint can be used for additional cleanup if needed.
    return {"success": True, "message": "Logged out successfully"}