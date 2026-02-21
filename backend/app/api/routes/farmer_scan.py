import random
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.deps import require_role, get_current_user
from app.core.storage import upload_image, get_object_url
from app.db.session import get_db
from app.models.pest import Pest
from app.models.scan import Scan
from app.schemas.scan import ScanResponse, PestDetectionResult, ScanHistoryResponse, ScanHistoryItem, ScanDetailResponse
from app.services.scan_service import ScanService

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
    current_user=Depends(get_current_user),
):
    content = await image.read()
    object_name = upload_image(image.filename, content, image.content_type)
    scan_image_url = get_object_url(object_name)

    pest = (
        db.query(Pest)
        .filter(Pest.status == "active")
        .order_by(func.rand())
        .first()
    )
    if not pest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No pests available")

    confidence = round(random.uniform(0.7, 0.98), 2)
    scan = Scan(
        farmer_id=current_user.id,
        pest_id=pest.id,
        image_path=scan_image_url,
        confidence=confidence,
        status="pending",
    )
    scan = ScanService.create(db, scan)

    result = PestDetectionResult(
        id=pest.id,
        name=pest.name_en,
        scientific_name=None,
        image_url=pest.image_path,
        crop_stage=pest.crop_stage,
        confidence=confidence,
        traditional_methods=_split_methods(pest.kem_methods),
        chemical_methods=_split_methods(pest.chemical_methods),
    )
    return ScanResponse(scan_id=scan.id, scan_image_url=scan.image_path, pest=result)


@router.get("/scans", response_model=ScanHistoryResponse, dependencies=[Depends(require_role("farmer"))])
def scan_history(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scans = ScanService.list_by_farmer(db, current_user.id, limit=50)
    items: list[ScanHistoryItem] = []
    for scan in scans:
        pest = db.query(Pest).filter(Pest.id == scan.pest_id).first()
        items.append(
            ScanHistoryItem(
                id=scan.id,
                date=scan.created_at.strftime("%d %b %Y") if scan.created_at else datetime.utcnow().strftime("%d %b %Y"),
                pest_name=pest.name_en if pest else "Unknown",
                status=scan.status or "pending",
                image_url=scan.image_path,
            )
        )
    return ScanHistoryResponse(items=items)


@router.get("/scans/{scan_id}", response_model=ScanDetailResponse, dependencies=[Depends(require_role("farmer"))])
def scan_detail(scan_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scan = (
        db.query(Scan)
        .filter(Scan.id == scan_id, Scan.farmer_id == current_user.id)
        .first()
    )
    if not scan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found")
    pest = db.query(Pest).filter(Pest.id == scan.pest_id).first()
    if not pest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pest not found")
    result = PestDetectionResult(
        id=pest.id,
        name=pest.name_en,
        scientific_name=None,
        image_url=pest.image_path,
        crop_stage=pest.crop_stage,
        confidence=scan.confidence,
        traditional_methods=_split_methods(pest.kem_methods),
        chemical_methods=_split_methods(pest.chemical_methods),
    )
    return ScanDetailResponse(
        id=scan.id,
        date=scan.created_at.strftime("%d %b %Y") if scan.created_at else datetime.utcnow().strftime("%d %b %Y"),
        status=scan.status or "pending",
        image_url=scan.image_path,
        pest=result,
    )
