from typing import Optional, List, Tuple
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


def get_user_by_phone(db: Session, phone: str) -> Optional[User]:
    return db.query(User).filter(User.phone == phone).first()


def get_user_by_officer_id(db: Session, officer_id: str) -> Optional[User]:
    return db.query(User).filter(User.officer_id == officer_id).first()


def list_users(
    db: Session,
    role: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
) -> Tuple[List[User], int]:
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(User.email.ilike(like), User.full_name.ilike(like), User.phone.ilike(like))
        )
    query = query.filter(User.status == "active")
    total = query.count()
    items = (
        query.order_by(User.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return items, total


def create_user(db: Session, user: User) -> User:
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def delete_user(db: Session, user: User) -> None:
    user.status = "deleted"
    db.commit()
