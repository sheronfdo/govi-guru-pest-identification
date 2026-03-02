from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.contact import ContactRequest
from app.schemas.contact import ContactListResponse, ContactUpdate, ContactOut

router = APIRouter(prefix="/admin/contact", tags=["admin-contact"])

@router.get("", response_model=ContactListResponse, dependencies=[Depends(require_role("admin"))])
def list_contacts_admin(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(ContactRequest)
    if status_filter:
        query = query.filter(ContactRequest.status == status_filter)
    items = query.order_by(ContactRequest.created_at.desc()).all()
    
    # Map to output schema explicitly handling datetime formatting
    out_items = []
    for item in items:
        out_items.append(ContactOut(
            id=item.id,
            name=item.name,
            contact_info=item.contact_info,
            message=item.message,
            status=item.status,
            created_at=item.created_at.strftime("%Y-%m-%d %H:%M:%S") if item.created_at else ""
        ))
        
    return ContactListResponse(items=out_items)

@router.patch("/{contact_id}", response_model=ContactOut, dependencies=[Depends(require_role("admin"))])
def update_contact_admin(
    contact_id: int,
    payload: ContactUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(ContactRequest).filter(ContactRequest.id == contact_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact request not found")
    
    item.status = payload.status
    db.commit()
    db.refresh(item)
    
    return ContactOut(
        id=item.id,
        name=item.name,
        contact_info=item.contact_info,
        message=item.message,
        status=item.status,
        created_at=item.created_at.strftime("%Y-%m-%d %H:%M:%S") if item.created_at else ""
    )
