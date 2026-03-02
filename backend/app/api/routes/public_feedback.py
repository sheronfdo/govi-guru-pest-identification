from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.db.session import get_db
from app.models.feedback import Feedback

router = APIRouter(prefix="/public/feedback", tags=["public-feedback"])

class PublicFeedbackCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    district: str = Field(min_length=2, max_length=100)
    experience: str = Field(min_length=2, max_length=100)
    comments: str = Field(min_length=5, max_length=5000)

@router.post("", status_code=status.HTTP_201_CREATED)
def submit_public_feedback(payload: PublicFeedbackCreate, db: Session = Depends(get_db)):
    subject = f"Public Feedback from {payload.name.strip()} ({payload.district.strip()})"
    message = f"Platform Experience: {payload.experience.strip()}\n\nDetailed Comments:\n{payload.comments.strip()}"
    
    item = Feedback(
        user_id=None,
        role="public",
        subject=subject,
        message=message,
        priority="normal",
        status="pending",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return {"message": "Feedback submitted successfully"}
