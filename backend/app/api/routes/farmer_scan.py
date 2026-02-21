import random
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.deps import require_role
from app.db.session import get_db
from app.models.pest import Pest
from app.schemas.scan import ScanResponse, PestDetectionResult

router = APIRouter(prefix="/farmer", tags=["farmer-scan"])


def _split_methods(text: str | None) -> list[str]:
    if not text:
        return []
    parts = [p.strip() for p in text.replace(";", "\n").splitlines()]
    return [p for p in parts if p]


@router.post("/scan", response_model=ScanResponse, dependencies=[Depends(require_role("farmer"))])
async def scan_pest(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    _ = await image.read()  # Model inference will use this later

    pest = (
        db.query(Pest)
        .filter(Pest.status == "active")
        .order_by(func.rand())
        .first()
    )
    if not pest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No pests available")

    result = PestDetectionResult(
        id=pest.id,
        name=pest.name_en,
        scientific_name=None,
        image_url=pest.image_path,
        confidence=round(random.uniform(0.7, 0.98), 2),
        traditional_methods=_split_methods(pest.kem_methods),
        chemical_methods=_split_methods(pest.chemical_methods),
    )
    return ScanResponse(pest=result)
