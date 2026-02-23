from sqlalchemy.orm import Session

from app.models.consultation import Consultation
from app.models.consultation_message import ConsultationMessage
from app.repositories.consultation_repo import (
    create_consultation,
    list_consultations,
    list_consultations_by_farmer,
    get_consultation,
    create_message,
    list_messages,
)


class ConsultationService:
    @staticmethod
    def create(db: Session, consultation: Consultation) -> Consultation:
        return create_consultation(db, consultation)

    @staticmethod
    def list_all(db: Session, limit: int = 50):
        return list_consultations(db, limit)

    @staticmethod
    def list_by_farmer(db: Session, farmer_id: int, limit: int = 50):
        return list_consultations_by_farmer(db, farmer_id, limit)

    @staticmethod
    def get(db: Session, consultation_id: int):
        return get_consultation(db, consultation_id)

    @staticmethod
    def add_message(db: Session, message: ConsultationMessage) -> ConsultationMessage:
        return create_message(db, message)

    @staticmethod
    def list_messages(db: Session, consultation_id: int):
        return list_messages(db, consultation_id)
