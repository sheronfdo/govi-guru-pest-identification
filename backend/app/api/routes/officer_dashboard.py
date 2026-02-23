from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.consultation import Consultation
from app.models.consultation_message import ConsultationMessage
from app.models.scan import Scan
from app.models.user import User
from app.schemas.officer_dashboard import OfficerDashboardResponse, DashboardActivity

router = APIRouter(prefix="/officer/dashboard", tags=["officer-dashboard"])


def _format_dt(dt: Optional[datetime]) -> str:
    if not dt:
        return datetime.utcnow().strftime("%d %b %Y %H:%M")
    return dt.strftime("%d %b %Y %H:%M")


@router.get("", response_model=OfficerDashboardResponse, dependencies=[Depends(require_role("officer"))])
def officer_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)

    total_farmers = (
        db.query(User)
        .filter(User.role == "farmer", User.status == "active")
        .count()
    )

    consultations = (
        db.query(Consultation)
        .order_by(Consultation.created_at.desc())
        .all()
    )
    consultation_ids = [c.id for c in consultations]

    pending_verifications = sum(1 for c in consultations if (c.status or "pending") == "pending")

    last_messages = {}
    if consultation_ids:
        msgs = (
            db.query(ConsultationMessage)
            .filter(ConsultationMessage.consultation_id.in_(consultation_ids))
            .order_by(ConsultationMessage.created_at.desc())
            .all()
        )
        for msg in msgs:
            if msg.consultation_id not in last_messages:
                last_messages[msg.consultation_id] = msg

    farmer_queries = 0
    for c in consultations:
        last_msg = last_messages.get(c.id)
        if (c.status or "pending") == "pending" and last_msg and last_msg.sender_role == "farmer":
            farmer_queries += 1

    scans_this_week = (
        db.query(Scan)
        .filter(Scan.created_at >= week_ago)
        .count()
    )
    active_pest_alerts = scans_this_week

    verified_count = sum(1 for c in consultations if (c.status or "") in {"verified", "corrected"})
    total_consultations = len(consultations)
    verification_rate = (verified_count / total_consultations) * 100 if total_consultations else 0.0

    avg_response_hours = 0.0
    response_samples = []
    if consultation_ids:
        msgs = (
            db.query(ConsultationMessage)
            .filter(ConsultationMessage.consultation_id.in_(consultation_ids))
            .order_by(ConsultationMessage.created_at.asc())
            .all()
        )
        by_consultation = {}
        for msg in msgs:
            by_consultation.setdefault(msg.consultation_id, []).append(msg)
        for _, thread in by_consultation.items():
            farmer_msg_time = next((m.created_at for m in thread if m.sender_role == "farmer"), None)
            officer_msg_time = next((m.created_at for m in thread if m.sender_role == "officer"), None)
            if farmer_msg_time and officer_msg_time:
                response_samples.append((officer_msg_time - farmer_msg_time).total_seconds() / 3600.0)
    if response_samples:
        avg_response_hours = sum(response_samples) / len(response_samples)

    activity_items: list[DashboardActivity] = []

    scan_rows = (
        db.query(Scan)
        .order_by(Scan.created_at.desc())
        .limit(6)
        .all()
    )
    scan_user_ids = {s.farmer_id for s in scan_rows}
    user_map = {}
    if scan_user_ids:
        for user in db.query(User).filter(User.id.in_(scan_user_ids)).all():
            user_map[user.id] = user

    for scan in scan_rows:
        farmer = user_map.get(scan.farmer_id)
        activity_items.append(
            DashboardActivity(
                farmer_name=farmer.full_name if farmer and farmer.full_name else "Farmer",
                action="submitted a new pest scan",
                time=_format_dt(scan.created_at),
                status="pending",
            )
        )

    for consultation in consultations[:6]:
        last_msg = last_messages.get(consultation.id)
        farmer = db.query(User).filter(User.id == consultation.farmer_id).first()
        if last_msg and last_msg.sender_role == "officer":
            action = "replied to a consultation"
            status = "completed"
        else:
            action = "requested a consultation"
            status = "pending"
        activity_items.append(
            DashboardActivity(
                farmer_name=farmer.full_name if farmer and farmer.full_name else "Farmer",
                action=action,
                time=_format_dt(last_msg.created_at if last_msg else consultation.created_at),
                status=status,
            )
        )

    def _parse_time(value: str) -> datetime:
        try:
            return datetime.strptime(value, "%d %b %Y %H:%M")
        except ValueError:
            return datetime.utcnow()

    activity_items = sorted(activity_items, key=lambda a: _parse_time(a.time), reverse=True)[:8]

    return OfficerDashboardResponse(
        pending_verifications=pending_verifications,
        farmer_queries=farmer_queries,
        active_pest_alerts=active_pest_alerts,
        total_farmers=total_farmers,
        verification_rate=round(verification_rate, 1),
        scans_this_week=scans_this_week,
        avg_response_hours=round(avg_response_hours, 1) if response_samples else 0.0,
        recent_activity=activity_items,
    )
