from typing import List, Optional
from pydantic import BaseModel


class DashboardActivity(BaseModel):
    farmer_name: str
    action: str
    time: str
    status: str


class OfficerDashboardResponse(BaseModel):
    pending_verifications: int
    farmer_queries: int
    active_pest_alerts: int
    total_farmers: int
    verification_rate: float
    scans_this_week: int
    avg_response_hours: float
    recent_activity: List[DashboardActivity]
