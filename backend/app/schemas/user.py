from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    role: Literal["admin", "officer", "farmer"]
    region: Optional[str] = Field(default=None, min_length=2, max_length=128)
    officer_id: Optional[str] = Field(default=None, min_length=3, max_length=64)
    phone: Optional[str] = Field(default=None, min_length=7, max_length=20)


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=128)

    @model_validator(mode="after")
    def validate_officer_requirements(self):
        if self.role == "officer" and not self.officer_id:
            raise ValueError("officer_id is required for officer role")
        return self


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    role: Optional[Literal["admin", "officer", "farmer"]] = None
    region: Optional[str] = Field(default=None, min_length=2, max_length=128)
    officer_id: Optional[str] = Field(default=None, min_length=3, max_length=64)
    phone: Optional[str] = Field(default=None, min_length=7, max_length=20)
    password: Optional[str] = Field(default=None, min_length=6, max_length=128)
    status: Optional[Literal["active", "inactive", "suspended"]] = None


class UserOut(UserBase):
    id: int
    status: str

    class Config:
        from_attributes = True
