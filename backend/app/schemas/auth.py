from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=1, max_length=255)  # email or phone or officer id
    password: str = Field(min_length=6, max_length=128)
    role: Literal["admin", "officer", "farmer"]

    @field_validator("identifier")
    @classmethod
    def validate_identifier(cls, value: str) -> str:
        identifier = value.strip()
        if not identifier:
            raise ValueError("Identifier is required")
        return identifier


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    region: Optional[str] = None
    officer_id: Optional[str] = None

    class Config:
        from_attributes = True


class FarmerRegisterRequest(BaseModel):
    email: EmailStr
    phone: Optional[str] = Field(default=None, min_length=7, max_length=20)
    password: str = Field(min_length=6, max_length=128)
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    region: Optional[str] = Field(default=None, min_length=2, max_length=128)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        phone = value.strip()
        if not phone:
            return None
        if not all(ch.isdigit() or ch in "+- ()" for ch in phone):
            raise ValueError("Phone contains invalid characters")
        return phone

    @field_validator("full_name", "region")
    @classmethod
    def normalize_optional_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None


class OfficerAccessRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    officer_id: str = Field(min_length=3, max_length=64)
    email: EmailStr
    region: str = Field(min_length=2, max_length=128)
    phone: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=6, max_length=128)

    @field_validator("full_name", "officer_id", "region", "phone")
    @classmethod
    def trim_required_strings(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Field cannot be empty")
        return normalized

    @field_validator("phone")
    @classmethod
    def validate_officer_phone(cls, value: str) -> str:
        if not all(ch.isdigit() or ch in "+- ()" for ch in value):
            raise ValueError("Phone contains invalid characters")
        return value
