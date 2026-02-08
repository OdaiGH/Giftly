from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from config import settings

# Async engine and session
engine = create_async_engine(settings.database_url, echo=False)
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

# Sync engine and session for synchronous functions
sync_engine = create_engine(settings.database_url.replace("postgresql+asyncpg://", "postgresql://"), echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def get_db_sync():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
