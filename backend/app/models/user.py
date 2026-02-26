from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(32), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(32), nullable=False)  # admin | officer | farmer
    region = Column(String(128), nullable=True)
    officer_id = Column(String(64), nullable=True)
    status = Column(String(32), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
