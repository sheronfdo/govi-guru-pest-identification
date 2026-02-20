from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.user import User


def get_user_by_identifier(db: Session, identifier: str, role: str) -> Optional[User]:
    return (
        db.query(User)
        .filter(User.role == role)
        .filter(or_(User.email == identifier, User.phone == identifier, User.officer_id == identifier))
        .first()
    )


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
