from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.core.storage import upload_image, get_object_url
from app.db.session import get_db
from app.models.consultation import Consultation
from app.models.consultation_message import ConsultationMessage
from app.models.scan import Scan
from app.models.pest import Pest
from app.models.user import User
from app.schemas.consultation import (
    ConsultationDetailResponse,
    ConsultationListResponse,
    ConsultationSummary,
    ConsultationMessageOut,
    ConsultationParty,
)
from app.services.consultation_service import ConsultationService

router = APIRouter(tags=["consultations"])


def _format_dt(dt: Optional[datetime]) -> str:
    return dt.strftime("%d %b %Y %H:%M") if dt else datetime.utcnow().strftime("%d %b %Y %H:%M")


def _get_scan_info(db: Session, scan_id: Optional[int]) -> dict:
    if not scan_id:
        return {"image_url": None, "pest_name": None, "confidence": None, "crop_stage": None}
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        return {"image_url": None, "pest_name": None, "confidence": None, "crop_stage": None}
    pest = db.query(Pest).filter(Pest.id == scan.pest_id).first()
    return {
        "image_url": scan.image_path,
        "pest_name": pest.name_en if pest else None,
        "confidence": scan.confidence,
        "crop_stage": pest.crop_stage if pest else None,
    }


def _get_user_name(db: Session, user_id: Optional[int]) -> Optional[str]:
    if not user_id:
        return None
    user = db.query(User).filter(User.id == user_id).first()
    return user.full_name if user else None


def _get_user_region(db: Session, user_id: Optional[int]) -> Optional[str]:
    if not user_id:
        return None
    user = db.query(User).filter(User.id == user_id).first()
    return user.region if user else None


def _build_detail(
    db: Session,
    consultation: Consultation,
    messages: list[ConsultationMessage],
) -> ConsultationDetailResponse:
    scan_info = _get_scan_info(db, consultation.scan_id)
    sender_ids = {msg.sender_id for msg in messages}
    users = db.query(User).filter(User.id.in_(sender_ids)).all() if sender_ids else []
    user_map = {user.id: user for user in users}

    return ConsultationDetailResponse(
        id=consultation.id,
        status=consultation.status or "pending",
        farmer=ConsultationParty(
            id=consultation.farmer_id,
            name=_get_user_name(db, consultation.farmer_id),
            region=_get_user_region(db, consultation.farmer_id),
        ),
        officer=ConsultationParty(
            id=consultation.officer_id,
            name=_get_user_name(db, consultation.officer_id),
            region=_get_user_region(db, consultation.officer_id),
        ) if consultation.officer_id else None,
        scan_id=consultation.scan_id,
        scan_image_url=scan_info["image_url"],
        scan_pest_name=scan_info["pest_name"],
        scan_confidence=scan_info["confidence"],
        scan_crop_stage=scan_info["crop_stage"],
        created_at=_format_dt(consultation.created_at),
        messages=[
            ConsultationMessageOut(
                id=msg.id,
                sender_id=msg.sender_id,
                sender_role=msg.sender_role,
                sender_name=user_map.get(msg.sender_id).full_name if user_map.get(msg.sender_id) else None,
                body=msg.body,
                attachment_url=msg.attachment_url,
                created_at=_format_dt(msg.created_at),
            )
            for msg in messages
        ],
    )


@router.post(
    "/farmer/consultations",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("farmer"))],
)
async def create_consultation(
    message: str = Form(...),
    scan_id: Optional[int] = Form(None),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if len(message.strip()) < 20:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Message too short")

    scan = None
    if scan_id:
        scan = (
            db.query(Scan)
            .filter(Scan.id == scan_id, Scan.farmer_id == current_user.id)
            .first()
        )
        if not scan:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found")

    attachment_url = None
    if attachment:
        content = await attachment.read()
        object_name = upload_image(attachment.filename, content, attachment.content_type)
        attachment_url = get_object_url(object_name)

    consultation = Consultation(
        farmer_id=current_user.id,
        scan_id=scan.id if scan else None,
        status="pending",
    )
    db.add(consultation)
    db.flush()

    msg = ConsultationMessage(
        consultation_id=consultation.id,
        sender_id=current_user.id,
        sender_role="farmer",
        body=message.strip(),
        attachment_url=attachment_url,
    )
    db.add(msg)
    db.commit()
    db.refresh(consultation)

    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)


@router.get(
    "/farmer/consultations",
    response_model=ConsultationListResponse,
    dependencies=[Depends(require_role("farmer"))],
)
def list_farmer_consultations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    consultations = ConsultationService.list_by_farmer(db, current_user.id, limit=100)
    items: list[ConsultationSummary] = []
    for consultation in consultations:
        messages = ConsultationService.list_messages(db, consultation.id)
        last_message = messages[-1] if messages else None
        scan_info = _get_scan_info(db, consultation.scan_id)
        items.append(
            ConsultationSummary(
                id=consultation.id,
                status=consultation.status or "pending",
                farmer_id=consultation.farmer_id,
                farmer_name=_get_user_name(db, consultation.farmer_id),
                farmer_region=_get_user_region(db, consultation.farmer_id),
                officer_id=consultation.officer_id,
                last_message=last_message.body if last_message else None,
                last_message_at=_format_dt(last_message.created_at) if last_message else None,
                last_message_sender_role=last_message.sender_role if last_message else None,
                scan_image_url=scan_info["image_url"],
                scan_pest_name=scan_info["pest_name"],
                scan_confidence=scan_info["confidence"],
                scan_crop_stage=scan_info["crop_stage"],
            )
        )
    return ConsultationListResponse(items=items)


@router.get(
    "/farmer/consultations/{consultation_id}",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("farmer"))],
)
def farmer_consultation_detail(
    consultation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    consultation = ConsultationService.get(db, consultation_id)
    if not consultation or consultation.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found")
    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)


@router.post(
    "/farmer/consultations/{consultation_id}/messages",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("farmer"))],
)
async def farmer_add_message(
    consultation_id: int,
    message: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not message.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Message required")
    consultation = ConsultationService.get(db, consultation_id)
    if not consultation or consultation.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found")

    attachment_url = None
    if attachment:
        content = await attachment.read()
        object_name = upload_image(attachment.filename, content, attachment.content_type)
        attachment_url = get_object_url(object_name)

    msg = ConsultationMessage(
        consultation_id=consultation.id,
        sender_id=current_user.id,
        sender_role="farmer",
        body=message.strip(),
        attachment_url=attachment_url,
    )
    db.add(msg)
    consultation.status = "pending"
    db.commit()
    db.refresh(consultation)

    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)


@router.get(
    "/officer/consultations",
    response_model=ConsultationListResponse,
    dependencies=[Depends(require_role("officer"))],
)
def list_officer_consultations(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    consultations = ConsultationService.list_all(db, limit=200)
    items: list[ConsultationSummary] = []
    for consultation in consultations:
        if status_filter and consultation.status != status_filter:
            continue
        messages = ConsultationService.list_messages(db, consultation.id)
        last_message = messages[-1] if messages else None
        scan_info = _get_scan_info(db, consultation.scan_id)
        items.append(
            ConsultationSummary(
                id=consultation.id,
                status=consultation.status or "pending",
                farmer_id=consultation.farmer_id,
                farmer_name=_get_user_name(db, consultation.farmer_id),
                farmer_region=_get_user_region(db, consultation.farmer_id),
                officer_id=consultation.officer_id,
                last_message=last_message.body if last_message else None,
                last_message_at=_format_dt(last_message.created_at) if last_message else None,
                last_message_sender_role=last_message.sender_role if last_message else None,
                scan_image_url=scan_info["image_url"],
                scan_pest_name=scan_info["pest_name"],
                scan_confidence=scan_info["confidence"],
                scan_crop_stage=scan_info["crop_stage"],
            )
        )
    return ConsultationListResponse(items=items)


@router.get(
    "/officer/consultations/{consultation_id}",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("officer"))],
)
def officer_consultation_detail(
    consultation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    consultation = ConsultationService.get(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found")
    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)


@router.post(
    "/officer/consultations/{consultation_id}/assign",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("officer"))],
)
def assign_consultation(
    consultation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    consultation = ConsultationService.get(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found")
    consultation.officer_id = current_user.id
    db.commit()
    db.refresh(consultation)
    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)


@router.post(
    "/officer/consultations/{consultation_id}/messages",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("officer"))],
)
async def officer_add_message(
    consultation_id: int,
    message: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not message.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Message required")
    consultation = ConsultationService.get(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found")

    attachment_url = None
    if attachment:
        content = await attachment.read()
        object_name = upload_image(attachment.filename, content, attachment.content_type)
        attachment_url = get_object_url(object_name)

    msg = ConsultationMessage(
        consultation_id=consultation.id,
        sender_id=current_user.id,
        sender_role="officer",
        body=message.strip(),
        attachment_url=attachment_url,
    )
    db.add(msg)
    consultation.status = "replied"
    if not consultation.officer_id:
        consultation.officer_id = current_user.id
    db.commit()
    db.refresh(consultation)

    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)


@router.post(
    "/officer/consultations/{consultation_id}/close",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("officer"))],
)
def close_consultation(
    consultation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    consultation = ConsultationService.get(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found")
    consultation.status = "closed"
    if not consultation.officer_id:
        consultation.officer_id = current_user.id
    db.commit()
    db.refresh(consultation)
    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)


@router.post(
    "/officer/consultations/{consultation_id}/verify",
    response_model=ConsultationDetailResponse,
    dependencies=[Depends(require_role("officer"))],
)
def verify_consultation(
    consultation_id: int,
    status: str = Form(...),
    note: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    consultation = ConsultationService.get(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found")

    normalized = status.strip().lower()
    if normalized not in {"verified", "corrected"}:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status")
    if normalized == "corrected" and not (note and note.strip()):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Correction note required")

    body = (note or "").strip()
    if not body:
        body = "Verification confirmed by agriculture officer."

    msg = ConsultationMessage(
        consultation_id=consultation.id,
        sender_id=current_user.id,
        sender_role="officer",
        body=body,
    )
    db.add(msg)
    consultation.status = normalized
    if not consultation.officer_id:
        consultation.officer_id = current_user.id
    db.commit()
    db.refresh(consultation)
    messages = ConsultationService.list_messages(db, consultation.id)
    return _build_detail(db, consultation, messages)
