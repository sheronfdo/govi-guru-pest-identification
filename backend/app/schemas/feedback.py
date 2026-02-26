from typing import List, Optional
from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    subject: str
    message: str
    priority: Optional[str] = "normal"


class FeedbackUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None


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
