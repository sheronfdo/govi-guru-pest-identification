from typing import List, Optional
from pydantic import BaseModel, EmailStr


class FarmerSummary(BaseModel):
    id: int
    full_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    region: Optional[str] = None
    total_scans: int = 0
    pending_consultations: int = 0
    last_scan_at: Optional[str] = None


class FarmerListResponse(BaseModel):
    items: List[FarmerSummary]
    total: int
