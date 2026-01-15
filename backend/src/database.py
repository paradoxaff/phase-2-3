from sqlmodel import create_engine, Session
from typing import Generator
from .config import settings

# Create the database engine
engine = create_engine(settings.database_url, echo=settings.debug)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session