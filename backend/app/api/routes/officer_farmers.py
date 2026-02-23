from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.consultation import Consultation
from app.models.scan import Scan
from app.models.user import User
from app.schemas.farmer import FarmerListResponse, FarmerSummary

router = APIRouter(prefix="/officer/farmers", tags=["officer-farmers"])


def _format_dt(dt: Optional[datetime]) -> Optional[str]:
    if not dt:
        return None
    return dt.strftime("%d %b %Y %H:%M")


@router.get("", response_model=FarmerListResponse, dependencies=[Depends(require_role("officer"))])
def list_farmers(
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(User).filter(User.role == "farmer", User.status == "active")
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                User.full_name.ilike(like),
                User.email.ilike(like),
                User.phone.ilike(like),
                User.region.ilike(like),
            )
        )

    farmers = query.order_by(User.id.desc()).all()
    farmer_ids = [f.id for f in farmers]

    scan_stats = {}
    if farmer_ids:
        rows = (
            db.query(
                Scan.farmer_id,
                func.count(Scan.id).label("total_scans"),
                func.max(Scan.created_at).label("last_scan_at"),
            )
            .filter(Scan.farmer_id.in_(farmer_ids))
            .group_by(Scan.farmer_id)
            .all()
        )
        scan_stats = {row.farmer_id: row for row in rows}

    pending_stats = {}
    if farmer_ids:
        rows = (
            db.query(
                Consultation.farmer_id,
                func.count(Consultation.id).label("pending_consultations"),
            )
            .filter(Consultation.farmer_id.in_(farmer_ids))
            .filter(Consultation.status == "pending")
            .group_by(Consultation.farmer_id)
            .all()
        )
        pending_stats = {row.farmer_id: row.pending_consultations for row in rows}

    items = []
    for farmer in farmers:
        stats = scan_stats.get(farmer.id)
        items.append(
            FarmerSummary(
                id=farmer.id,
                full_name=farmer.full_name,
                email=farmer.email,
                phone=farmer.phone,
                region=farmer.region,
                total_scans=stats.total_scans if stats else 0,
                pending_consultations=pending_stats.get(farmer.id, 0),
                last_scan_at=_format_dt(stats.last_scan_at) if stats else None,
            )
        )

    return FarmerListResponse(items=items, total=len(items))
