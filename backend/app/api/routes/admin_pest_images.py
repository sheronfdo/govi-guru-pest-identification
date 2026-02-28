from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import require_role
from app.core.storage import upload_image, get_object_url
from app.db.session import get_db
from app.services.pest_service import PestService

router = APIRouter(prefix="/admin/pests", tags=["admin-pest-images"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


@router.post("/{pest_id}/image", dependencies=[Depends(require_role("admin"))])
async def update_pest_image(
    pest_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
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
    image_path = get_object_url(object_name)
    pest = PestService.update(db, pest_id, {"image_path": image_path})
    if not pest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pest not found")
    return {"image_path": image_path}
