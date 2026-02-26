from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.consultation import Consultation
from app.models.consultation_message import ConsultationMessage


def create_consultation(db: Session, consultation: Consultation) -> Consultation:
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return consultation


def list_consultations(db: Session, limit: int = 50) -> List[Consultation]:
    return db.query(Consultation).order_by(Consultation.id.desc()).limit(limit).all()


def list_consultations_by_farmer(db: Session, farmer_id: int, limit: int = 50) -> List[Consultation]:
    return (
        db.query(Consultation)
        .filter(Consultation.farmer_id == farmer_id)
        .order_by(Consultation.id.desc())
        .limit(limit)
        .all()
    )


def get_consultation(db: Session, consultation_id: int) -> Optional[Consultation]:
    return db.query(Consultation).filter(Consultation.id == consultation_id).first()


def create_message(db: Session, message: ConsultationMessage) -> ConsultationMessage:
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def list_messages(db: Session, consultation_id: int) -> List[ConsultationMessage]:
    return (
        db.query(ConsultationMessage)
        .filter(ConsultationMessage.consultation_id == consultation_id)
        .order_by(ConsultationMessage.id.asc())
        .all()
    )
