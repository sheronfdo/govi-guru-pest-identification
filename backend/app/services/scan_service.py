from sqlalchemy.orm import Session

from app.models.scan import Scan
from app.repositories.scan_repo import create_scan, list_scans_by_farmer


class ScanService:
    @staticmethod
    def create(db: Session, scan: Scan) -> Scan:
        return create_scan(db, scan)

    @staticmethod
    def list_by_farmer(db: Session, farmer_id: int, limit: int = 20):
        return list_scans_by_farmer(db, farmer_id, limit)
