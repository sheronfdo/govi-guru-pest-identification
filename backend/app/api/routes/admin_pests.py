from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.core.storage import save_upload_file
from app.db.session import get_db
from app.models.pest import Pest
from app.schemas.common import PaginatedResponse
from app.schemas.pest import PestOut, PestUpdate
from app.services.pest_service import PestService

router = APIRouter(prefix="/admin/pests", tags=["admin-pests"])


@router.get("", response_model=PaginatedResponse[PestOut], dependencies=[Depends(require_role("admin"))])
def list_pests(
    q: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    items, total = PestService.list(db, q, page, limit)
    return PaginatedResponse(items=items, total=total, page=page, limit=limit)


@router.post("", response_model=PestOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("admin"))])
async def create_pest(
    name_en: str = Form(...),
    name_si: Optional[str] = Form(None),
    name_ta: Optional[str] = Form(None),
    crop_stage: Optional[str] = Form(None),
    chemical_methods: Optional[str] = Form(None),
    kem_methods: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    image_path = None
    if image is not None:
        content = await image.read()
        image_path = save_upload_file(image.filename, content)

    pest = Pest(
        name_en=name_en,
        name_si=name_si,
        name_ta=name_ta,
        crop_stage=crop_stage,
        chemical_methods=chemical_methods,
        kem_methods=kem_methods,
        image_path=image_path,
    )
    return PestService.create(db, pest)


@router.patch("/{pest_id}", response_model=PestOut, dependencies=[Depends(require_role("admin"))])
def update_pest(
    pest_id: int,
    payload: PestUpdate,
    db: Session = Depends(get_db),
):
    pest = PestService.update(db, pest_id, payload.model_dump(exclude_unset=True))
    if not pest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pest not found")
    return pest


@router.delete("/{pest_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_role("admin"))])
def delete_pest(pest_id: int, db: Session = Depends(get_db)):
    ok = PestService.delete(db, pest_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pest not found")
    return None
