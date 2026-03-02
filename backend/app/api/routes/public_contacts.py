from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contact import ContactRequest
from app.schemas.contact import ContactCreate

router = APIRouter(prefix="/public/contact", tags=["public-contact"])

@router.post("", status_code=status.HTTP_201_CREATED)
def submit_contact_request(payload: ContactCreate, db: Session = Depends(get_db)):
    item = ContactRequest(
        name=payload.name,
        contact_info=payload.contact_info,
        message=payload.message,
        status="pending"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": "Contact request submitted successfully"}
