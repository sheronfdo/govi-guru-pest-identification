from typing import List
from pydantic import BaseModel


class AdminActivity(BaseModel):
    user: str
    action: str
    time: str


class AdminDashboardResponse(BaseModel):
    total_farmers: int
    active_officers: int
    scans_today: int
    pending_issues: int
    recent_activity: List[AdminActivity]
