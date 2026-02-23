from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.feedback import Feedback
from app.models.user import User
from app.schemas.feedback import FeedbackCreate, FeedbackListResponse, FeedbackOut, FeedbackUpdate

router = APIRouter(tags=["feedback"])


def _format_dt(dt: Optional[datetime]) -> str:
    return dt.strftime("%Y-%m-%d %H:%M") if dt else datetime.utcnow().strftime("%Y-%m-%d %H:%M")


def _to_out(item: Feedback) -> FeedbackOut:
    return FeedbackOut(
        id=item.id,
        user_id=item.user_id,
        role=item.role,
        subject=item.subject,
        message=item.message,
        status=item.status,
        priority=item.priority,
        created_at=_format_dt(item.created_at),
    )


@router.post(
    "/farmer/feedback",
    response_model=FeedbackOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("farmer"))],
)
def create_farmer_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not payload.subject.strip() or not payload.message.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Subject and message required")
    priority = (payload.priority or "normal").lower()
    if priority not in {"normal", "urgent"}:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid priority")
    item = Feedback(
        user_id=current_user.id,
        role="farmer",
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        priority=priority,
        status="urgent" if priority == "urgent" else "pending",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_out(item)


@router.post(
    "/officer/feedback",
    response_model=FeedbackOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("officer"))],
)
def create_officer_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not payload.subject.strip() or not payload.message.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Subject and message required")
    priority = (payload.priority or "normal").lower()
    if priority not in {"normal", "urgent"}:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid priority")
    item = Feedback(
        user_id=current_user.id,
        role="officer",
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        priority=priority,
        status="urgent" if priority == "urgent" else "pending",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_out(item)


@router.get(
    "/admin/feedback",
    response_model=FeedbackListResponse,
    dependencies=[Depends(require_role("admin"))],
)
def list_feedback_admin(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(Feedback)
    if status_filter:
        query = query.filter(Feedback.status == status_filter)
    items = query.order_by(Feedback.created_at.desc()).all()
    return FeedbackListResponse(items=[_to_out(item) for item in items])


@router.patch(
    "/admin/feedback/{feedback_id}",
    response_model=FeedbackOut,
    dependencies=[Depends(require_role("admin"))],
)
def update_feedback_admin(
    feedback_id: int,
    payload: FeedbackUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    if payload.status:
        status_norm = payload.status.lower()
        if status_norm not in {"pending", "urgent", "resolved"}:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status")
        item.status = status_norm
    if payload.priority:
        priority_norm = payload.priority.lower()
        if priority_norm not in {"normal", "urgent"}:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid priority")
        item.priority = priority_norm
    db.commit()
    db.refresh(item)
    return _to_out(item)
