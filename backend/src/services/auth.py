from sqlmodel import Session, select
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
import uuid

from ..models.user import User, UserCreate
from ..config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Bcrypt has a maximum password length of 72 bytes
    # Truncate if necessary to prevent ValueError
    if len(plain_password.encode('utf-8')) > 72:
        plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    # Handle bcrypt backend issues by using a more robust approach
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except ValueError as e:
        if "password cannot be longer than 72 bytes" in str(e):
            # This should already be handled, but just in case
            truncated_password = plain_password[:72]
            return pwd_context.verify(truncated_password, hashed_password)
        else:
            raise

def hash_password(password: str) -> str:
    # Bcrypt has a maximum password length of 72 bytes
    # Truncate if necessary to prevent ValueError
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    # Handle bcrypt backend issues by using a more robust approach
    try:
        return pwd_context.hash(password)
    except ValueError as e:
        if "password cannot be longer than 72 bytes" in str(e):
            # This should already be handled, but just in case
            truncated_password = password[:72]
            return pwd_context.hash(truncated_password)
        else:
            raise

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt

def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()

    if not user or not verify_password(password, user.password_hash):
        return None

    return user

def create_user(session: Session, user_create: UserCreate) -> User:
    hashed_password = hash_password(user_create.password)
    db_user = User(
        email=user_create.email,
        password_hash=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user