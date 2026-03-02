from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.pest import PestOut
from app.services.pest_service import PestService

router = APIRouter(prefix="/public/pests", tags=["public-pests"])

@router.get("", response_model=PaginatedResponse[PestOut])
def list_public_pests(
    q: Optional[str] = Query(default=None, max_length=100),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = PestService.list(db, q, page, limit)
    return PaginatedResponse(items=items, total=total, page=page, limit=limit)
