from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import require_role, get_current_user
from app.core.storage import upload_image, get_object_url
from app.db.session import get_db
from app.models.pest import Pest
from app.models.scan import Scan
from app.schemas.scan import ScanResponse, PestDetectionResult, ScanHistoryResponse, ScanHistoryItem, ScanDetailResponse
from app.services.scan_service import ScanService
from app.services.pest_classifier import predict_image_bytes

router = APIRouter(prefix="/farmer", tags=["farmer-scan"])


def _split_methods(text: str | None) -> list[str]:
    if not text:
        return []
    parts = [p.strip() for p in text.replace(";", "\n").splitlines()]
    return [p for p in parts if p]

def _is_non_pest_class(class_name: str) -> bool:
    normalized = "".join(ch for ch in class_name.lower() if ch.isalnum())
    return normalized == "nonpest"


@router.post("/scan", response_model=ScanResponse, dependencies=[Depends(require_role("farmer"))])
async def scan_pest(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    content = await image.read()
    object_name = upload_image(image.filename, content, image.content_type)
    scan_image_url = get_object_url(object_name)

    prediction = predict_image_bytes(content)
    predicted_class = prediction.class_name

    if _is_non_pest_class(predicted_class):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No pest detected in the uploaded image",
        )

    pest = (
        db.query(Pest)
        .filter(Pest.status == "active", Pest.name_en == predicted_class)
        .first()
    )
    if not pest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Predicted pest '{predicted_class}' not found in database",
        )

    confidence = round(prediction.confidence, 2)
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
