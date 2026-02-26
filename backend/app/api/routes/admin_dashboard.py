from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.consultation import Consultation
from app.models.consultation_message import ConsultationMessage
from app.models.feedback import Feedback
from app.models.scan import Scan
from app.models.user import User
from app.schemas.admin_dashboard import AdminDashboardResponse, AdminActivity

router = APIRouter(prefix="/admin/dashboard", tags=["admin-dashboard"])


def _format_dt(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M")


@router.get("", response_model=AdminDashboardResponse, dependencies=[Depends(require_role("admin"))])
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)

    total_farmers = (
        db.query(User)
        .filter(User.role == "farmer", User.status == "active")
        .count()
    )
    active_officers = (
        db.query(User)
        .filter(User.role == "officer", User.status == "active")
        .count()
    )
    scans_today = (
        db.query(Scan)
        .filter(Scan.created_at >= today_start)
        .count()
    )
    pending_issues = (
        db.query(Consultation)
        .filter(Consultation.status == "pending")
        .count()
    )

    activities: list[AdminActivity] = []

    # Latest scans
    scan_rows = (
        db.query(Scan)
        .order_by(Scan.created_at.desc())
        .limit(4)
        .all()
    )
    farmer_ids = {s.farmer_id for s in scan_rows}
    farmer_map = {}
    if farmer_ids:
        for u in db.query(User).filter(User.id.in_(farmer_ids)).all():
            farmer_map[u.id] = u
    for scan in scan_rows:
        farmer = farmer_map.get(scan.farmer_id)
        activities.append(
            AdminActivity(
                user=farmer.full_name if farmer and farmer.full_name else "Farmer",
                action="uploaded a photo",
                time=_format_dt(scan.created_at or now),
            )
        )

    # Latest consultation replies
    msg_rows = (
        db.query(ConsultationMessage)
        .order_by(ConsultationMessage.created_at.desc())
        .limit(4)
        .all()
    )
    user_ids = {m.sender_id for m in msg_rows}
    user_map = {}
    if user_ids:
        for u in db.query(User).filter(User.id.in_(user_ids)).all():
            user_map[u.id] = u
    for msg in msg_rows:
        sender = user_map.get(msg.sender_id)
        action = "requested consultation" if msg.sender_role == "farmer" else "replied to consultation"
        activities.append(
            AdminActivity(
                user=sender.full_name if sender and sender.full_name else msg.sender_role.title(),
                action=action,
                time=_format_dt(msg.created_at or now),
            )
        )

    # Latest feedback
    feedback_rows = (
        db.query(Feedback)
        .order_by(Feedback.created_at.desc())
        .limit(4)
        .all()
    )
    fb_user_ids = {f.user_id for f in feedback_rows if f.user_id}
    fb_user_map = {}
    if fb_user_ids:
        for u in db.query(User).filter(User.id.in_(fb_user_ids)).all():
            fb_user_map[u.id] = u
    for fb in feedback_rows:
        sender = fb_user_map.get(fb.user_id)
        activities.append(
            AdminActivity(
                user=sender.full_name if sender and sender.full_name else fb.role.title(),
                action="provided feedback",
                time=_format_dt(fb.created_at or now),
            )
        )

    # sort latest
    activities = sorted(activities, key=lambda a: a.time, reverse=True)[:8]

    return AdminDashboardResponse(
        total_farmers=total_farmers,
        active_officers=active_officers,
        scans_today=scans_today,
        pending_issues=pending_issues,
        recent_activity=activities,
    )
