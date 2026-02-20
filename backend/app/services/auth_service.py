from typing import Optional
from sqlalchemy.orm import Session

from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.models.user import User
from app.repositories.user_repo import get_user_by_identifier, get_user_by_email, get_user_by_phone, create_user


class AuthService:
    @staticmethod
    def authenticate(db: Session, identifier: str, password: str, role: str) -> Optional[User]:
        user = get_user_by_identifier(db, identifier, role)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def issue_token(user: User) -> str:
        return create_access_token(subject=str(user.id), role=user.role)

    @staticmethod
    def register_farmer(
        db: Session,
        email: str,
        phone: str | None,
        password: str,
        full_name: str | None,
        region: str | None,
    ) -> User:
        if get_user_by_email(db, email):
            raise ValueError("Email already registered")
        if phone and get_user_by_phone(db, phone):
            raise ValueError("Phone number already registered")
        user = User(
            email=email,
            phone=phone,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            region=region,
            role="farmer",
        )
        return create_user(db, user)

    @staticmethod
    def request_officer_access(db: Session, full_name: str, officer_id: str, region: str, phone: str, password: str) -> User:
        # In production, this should create a pending approval record.
        user = User(
            email=f"officer_{officer_id}@goviguru.local",
            phone=phone,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            region=region,
            officer_id=officer_id,
            role="officer",
        )
        return create_user(db, user)

    @staticmethod
    def ensure_default_admin(db: Session, email: str, password: str) -> User | None:
        existing = get_user_by_email(db, email)
        if existing:
            return None
        admin = User(
            email=email,
            phone=None,
            hashed_password=get_password_hash(password),
            full_name="System Admin",
            role="admin",
            region=None,
            officer_id=None,
        )
        return create_user(db, admin)
