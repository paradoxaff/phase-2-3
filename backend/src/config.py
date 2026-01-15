from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    better_auth_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    debug: bool = False

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields not defined in the model

settings = Settings()