from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.pest import Pest
from app.repositories.pest_repo import list_pests, get_pest_by_id, create_pest, delete_pest


class PestService:
    @staticmethod
    def list(
        db: Session,
        q: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> tuple[List[Pest], int]:
        return list_pests(db, q, page, limit)

    @staticmethod
    def create(db: Session, pest: Pest) -> Pest:
        return create_pest(db, pest)

    @staticmethod
    def update(db: Session, pest_id: int, data: dict) -> Optional[Pest]:
        pest = get_pest_by_id(db, pest_id)
        if not pest:
            return None
        for key, value in data.items():
            setattr(pest, key, value)
        db.commit()
        db.refresh(pest)
        return pest

    @staticmethod
    def delete(db: Session, pest_id: int) -> bool:
        pest = get_pest_by_id(db, pest_id)
        if not pest:
            return False
        delete_pest(db, pest)
        return True
