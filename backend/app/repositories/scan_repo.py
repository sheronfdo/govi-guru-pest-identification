from typing import List
from sqlalchemy.orm import Session

from app.models.scan import Scan


def create_scan(db: Session, scan: Scan) -> Scan:
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan


def list_scans_by_farmer(db: Session, farmer_id: int, limit: int = 20) -> List[Scan]:
    return (
        db.query(Scan)
        .filter(Scan.farmer_id == farmer_id)
        .order_by(Scan.id.desc())
        .limit(limit)
        .all()
    )
