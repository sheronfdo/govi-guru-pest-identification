from typing import List, Optional, Tuple
from sqlalchemy.orm import Session

from app.models.pest import Pest


def list_pests(
    db: Session,
    q: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
) -> Tuple[List[Pest], int]:
    query = db.query(Pest)
    if q:
        like = f"%{q}%"
        query = query.filter(Pest.name_en.ilike(like))
    query = query.filter(Pest.status == "active")
    total = query.count()
    items = (
        query.order_by(Pest.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return items, total


def get_pest_by_id(db: Session, pest_id: int) -> Optional[Pest]:
    return db.query(Pest).filter(Pest.id == pest_id).first()


def create_pest(db: Session, pest: Pest) -> Pest:
    db.add(pest)
    db.commit()
    db.refresh(pest)
    return pest


def delete_pest(db: Session, pest: Pest) -> None:
    pest.status = "deleted"
    db.commit()
