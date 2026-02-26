from typing import Optional, List
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.user import User
from app.repositories.user_repo import list_users, get_user_by_id, create_user, delete_user
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    @staticmethod
    def list(
        db: Session,
        role: Optional[str] = None,
        q: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> tuple[List[User], int]:
        return list_users(db, role, q, page, limit)

    @staticmethod
    def create(db: Session, payload: UserCreate) -> User:
        user = User(
            email=payload.email,
            phone=payload.phone,
            full_name=payload.full_name,
            role=payload.role,
            region=payload.region,
            officer_id=payload.officer_id,
            hashed_password=get_password_hash(payload.password),
            status="active",
        )
        return create_user(db, user)

    @staticmethod
    def update(db: Session, user_id: int, payload: UserUpdate) -> Optional[User]:
        user = get_user_by_id(db, user_id)
        if not user:
            return None
        data = payload.model_dump(exclude_unset=True)
        if "password" in data:
            user.hashed_password = get_password_hash(data.pop("password"))
        for key, value in data.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete(db: Session, user_id: int) -> bool:
        user = get_user_by_id(db, user_id)
        if not user:
            return False
        delete_user(db, user)
        return True
