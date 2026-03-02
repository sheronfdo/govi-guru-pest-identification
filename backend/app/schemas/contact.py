from typing import List, Literal, Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    contact_info: str = Field(min_length=5, max_length=255)
    message: str = Field(min_length=5, max_length=5000)

    @field_validator("name", "contact_info", "message")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Field cannot be empty")
        return normalized

class ContactUpdate(BaseModel):
    status: Literal["pending", "resolved"]

class ContactOut(BaseModel):
    id: int
    name: str
    contact_info: str
    message: str
    status: str
    created_at: str

class ContactListResponse(BaseModel):
    items: List[ContactOut]
