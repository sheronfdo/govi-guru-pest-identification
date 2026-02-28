from typing import List, Literal, Optional

from pydantic import BaseModel, Field, field_validator


class FeedbackCreate(BaseModel):
    subject: str = Field(min_length=3, max_length=255)
    message: str = Field(min_length=10, max_length=5000)
    priority: Optional[Literal["normal", "urgent"]] = "normal"

    @field_validator("subject", "message")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Field cannot be empty")
        return normalized


class FeedbackUpdate(BaseModel):
    status: Optional[Literal["pending", "urgent", "resolved"]] = None
    priority: Optional[Literal["normal", "urgent"]] = None


class FeedbackOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    role: str
    subject: str
    message: str
    status: str
    priority: str
    created_at: str


class FeedbackListResponse(BaseModel):
    items: List[FeedbackOut]
