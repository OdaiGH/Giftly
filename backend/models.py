from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    email = Column(String, unique=True, nullable=True)
    name = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    is_verified = Column(Boolean, default=False)
    otp = Column(String, nullable=True)
    otp_created_at = Column(DateTime, default=func.now())
    is_admin = Column(Boolean, default=False)
    role = Column(String, default='Customer')
    admin_username = Column(String, unique=True, nullable=True)
    admin_password_hash = Column(String, nullable=True)

    # Relationship to JWT tokens
    jwt_tokens = relationship("JWTToken", back_populates="user", cascade="all, delete-orphan")

class JWTToken(Base):
    __tablename__ = "jwt_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    access_token = Column(String, unique=True, nullable=False, index=True)
    refresh_token = Column(String, unique=True, nullable=False, index=True)
    access_token_expires_at = Column(DateTime, nullable=False)
    refresh_token_expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    # Relationship back to user
    user = relationship("User", back_populates="jwt_tokens")
