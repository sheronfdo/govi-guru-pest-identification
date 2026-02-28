from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.user import UserOut, UserCreate, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/admin/users", tags=["admin-users"])


@router.get("", response_model=PaginatedResponse[UserOut], dependencies=[Depends(require_role("admin"))])
def list_users(
    role: Optional[Literal["admin", "officer", "farmer"]] = None,
    q: Optional[str] = Query(default=None, max_length=100),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = UserService.list(db, role, q, page, limit)
    return PaginatedResponse(items=items, total=total, page=page, limit=limit)


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("admin"))])
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    return UserService.create(db, payload)


@router.patch("/{user_id}", response_model=UserOut, dependencies=[Depends(require_role("admin"))])
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    user = UserService.update(db, user_id, payload)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("admin"))])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    ok = UserService.delete(db, user_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return None
