from typing import Optional
from sqlalchemy.orm import Session

from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.models.user import User
from app.repositories.user_repo import (
    get_user_by_identifier,
    get_user_by_email,
    get_user_by_phone,
    get_user_by_officer_id,
    create_user,
)


class AuthService:
    @staticmethod
    def authenticate(db: Session, identifier: str, password: str, role: str) -> Optional[User]:
        user = get_user_by_identifier(db, identifier.strip(), role)
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
        email_value = email.strip().lower()
        phone_value = phone.strip() if phone else None
        full_name_value = full_name.strip() if full_name else None
        region_value = region.strip() if region else None

        if get_user_by_email(db, email_value):
            raise ValueError("Email already registered")
        if phone_value and get_user_by_phone(db, phone_value):
            raise ValueError("Phone number already registered")
        user = User(
            email=email_value,
            phone=phone_value,
            hashed_password=get_password_hash(password),
            full_name=full_name_value,
            region=region_value,
            role="farmer",
            status="active",
        )
        return create_user(db, user)

    @staticmethod
    def request_officer_access(db: Session, full_name: str, officer_id: str, region: str, phone: str, password: str) -> User:
        # In production, this should create a pending approval record.
        domain = settings.system_email_domain
        full_name_value = full_name.strip()
        officer_id_value = officer_id.strip()
        region_value = region.strip()
        phone_value = phone.strip()

        if get_user_by_officer_id(db, officer_id_value):
            raise ValueError("Officer ID already registered")
        if get_user_by_phone(db, phone_value):
            raise ValueError("Phone number already registered")
        user = User(
            email=f"officer_{officer_id_value}@{domain}",
            phone=phone_value,
            hashed_password=get_password_hash(password),
            full_name=full_name_value,
            region=region_value,
            officer_id=officer_id_value,
            role="officer",
            status="active",
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
            status="active",
        )
        return create_user(db, admin)
