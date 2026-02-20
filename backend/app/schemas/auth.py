from pydantic import BaseModel, EmailStr
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    identifier: str  # email or phone or officer id
    password: str
    role: str


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
    phone: Optional[str] = None
    password: str
    full_name: Optional[str] = None
    region: Optional[str] = None


class OfficerAccessRequest(BaseModel):
    full_name: str
    officer_id: str
    region: str
    phone: str
    password: str
