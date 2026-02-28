from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.core.storage import upload_image, get_object_url
from app.db.session import get_db
from app.models.pest import Pest
from app.schemas.common import PaginatedResponse
from app.schemas.pest import PestOut, PestUpdate
from app.services.pest_service import PestService

router = APIRouter(prefix="/admin/pests", tags=["admin-pests"])

ALLOWED_CROP_STAGES = {"seedling", "vegetative", "reproductive", "ripening"}
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def _clean_optional_text(value: Optional[str], *, max_length: int) -> Optional[str]:
    if value is None:
        return None
    normalized = value.strip()
    if not normalized:
        return None
    if len(normalized) > max_length:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Text is too long")
    return normalized


def _clean_required_text(value: str, *, max_length: int, field: str) -> str:
    normalized = value.strip()
    if not normalized:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"{field} is required")
    if len(normalized) > max_length:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"{field} is too long")
    return normalized


async def _upload_pest_image(image: UploadFile) -> str:
    content_type = (image.content_type or "").lower()
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Image must be a JPG, PNG, or WEBP file",
        )
    content = await image.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Image is empty")
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Image exceeds 5MB")
    object_name = upload_image(image.filename, content, image.content_type)
    return get_object_url(object_name)


@router.get("", response_model=PaginatedResponse[PestOut], dependencies=[Depends(require_role("admin"))])
def list_pests(
    q: Optional[str] = Query(default=None, max_length=100),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
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
    name_en_value = _clean_required_text(name_en, max_length=255, field="English name")
    name_si_value = _clean_optional_text(name_si, max_length=255)
    name_ta_value = _clean_optional_text(name_ta, max_length=255)
    crop_stage_value = _clean_optional_text(crop_stage, max_length=64)
    chemical_methods_value = _clean_optional_text(chemical_methods, max_length=5000)
    kem_methods_value = _clean_optional_text(kem_methods, max_length=5000)
    if crop_stage_value and crop_stage_value not in ALLOWED_CROP_STAGES:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid crop stage")

    image_path = None
    if image is not None:
        image_path = await _upload_pest_image(image)

    pest = Pest(
        name_en=name_en_value,
        name_si=name_si_value,
        name_ta=name_ta_value,
        crop_stage=crop_stage_value,
        chemical_methods=chemical_methods_value,
        kem_methods=kem_methods_value,
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
