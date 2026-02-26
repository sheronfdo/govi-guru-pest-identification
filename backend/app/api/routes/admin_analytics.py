from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.consultation import Consultation
from app.models.consultation_message import ConsultationMessage
from app.models.pest import Pest
from app.models.scan import Scan
from app.models.user import User
from app.schemas.admin_analytics import (
    AdminAnalyticsResponse,
    MonthlyUsers,
    PestCount,
    RegionActivity,
)

router = APIRouter(prefix="/admin/analytics", tags=["admin-analytics"])


def _month_label(dt: datetime) -> str:
    return dt.strftime("%b")


@router.get("", response_model=AdminAnalyticsResponse, dependencies=[Depends(require_role("admin"))])
def admin_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)

    # Most common pests this month
    pest_rows = (
        db.query(Pest.name_en, func.count(Scan.id))
        .join(Scan, Scan.pest_id == Pest.id)
        .filter(Scan.created_at >= month_start)
        .group_by(Pest.name_en)
        .order_by(func.count(Scan.id).desc())
        .limit(8)
        .all()
    )
    pest_counts = [PestCount(name=row[0], count=row[1]) for row in pest_rows]

    # User registrations trend (last 7 months)
    registration_trend: list[MonthlyUsers] = []
    for offset in range(6, -1, -1):
        year = now.year
        month = now.month - offset
        while month <= 0:
            month += 12
            year -= 1
        month_start_dt = datetime(year, month, 1)
        if month == 12:
            month_end_dt = datetime(year + 1, 1, 1)
        else:
            month_end_dt = datetime(year, month + 1, 1)
        count = (
            db.query(User)
            .filter(User.created_at >= month_start_dt, User.created_at < month_end_dt)
            .count()
        )
        registration_trend.append(MonthlyUsers(month=_month_label(month_start_dt), users=count))

    # Regional activity by scans
    region_rows = (
        db.query(User.region, func.count(Scan.id))
        .join(Scan, Scan.farmer_id == User.id)
        .filter(User.role == "farmer")
        .group_by(User.region)
        .order_by(func.count(Scan.id).desc())
        .limit(8)
        .all()
    )
    regions: list[RegionActivity] = []
    for name, count in region_rows:
        intensity = "low"
        if count >= 200:
            intensity = "high"
        elif count >= 100:
            intensity = "medium"
        regions.append(RegionActivity(name=name or "Unknown", intensity=intensity, count=count))

    total_scans_this_month = (
        db.query(Scan)
        .filter(Scan.created_at >= month_start)
        .count()
    )

    # Average response time (first farmer message -> first officer message)
    consultation_ids = [cid for (cid,) in db.query(Consultation.id).all()]
    response_samples = []
    if consultation_ids:
        msgs = (
            db.query(ConsultationMessage)
            .filter(ConsultationMessage.consultation_id.in_(consultation_ids))
            .order_by(ConsultationMessage.created_at.asc())
            .all()
        )
        by_consultation: dict[int, list[ConsultationMessage]] = {}
        for msg in msgs:
            by_consultation.setdefault(msg.consultation_id, []).append(msg)
        for thread in by_consultation.values():
            farmer_msg_time = next((m.created_at for m in thread if m.sender_role == "farmer"), None)
            officer_msg_time = next((m.created_at for m in thread if m.sender_role == "officer"), None)
            if farmer_msg_time and officer_msg_time:
                response_samples.append((officer_msg_time - farmer_msg_time).total_seconds() / 3600.0)
    avg_response_hours = round(sum(response_samples) / len(response_samples), 1) if response_samples else 0.0

    # AI accuracy proxy = average confidence of scans this month
    avg_conf = (
        db.query(func.avg(Scan.confidence))
        .filter(Scan.created_at >= month_start)
        .scalar()
    )
    ai_accuracy_rate = round((avg_conf or 0) * 100, 1)

    return AdminAnalyticsResponse(
        pest_counts=pest_counts,
        registration_trend=registration_trend,
        regions=regions,
        total_scans_this_month=total_scans_this_month,
        avg_response_hours=avg_response_hours,
        ai_accuracy_rate=ai_accuracy_rate,
    )
