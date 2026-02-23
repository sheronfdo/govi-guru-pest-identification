from typing import List, Optional
from pydantic import BaseModel


class ConsultationMessageOut(BaseModel):
    id: int
    sender_id: int
    sender_role: str
    sender_name: Optional[str] = None
    body: str
    attachment_url: Optional[str] = None
    created_at: str


class ConsultationParty(BaseModel):
    id: int
    name: Optional[str] = None
    region: Optional[str] = None


class ConsultationDetailResponse(BaseModel):
    id: int
    status: str
    farmer: ConsultationParty
    officer: Optional[ConsultationParty] = None
    scan_id: Optional[int] = None
    scan_image_url: Optional[str] = None
    scan_pest_name: Optional[str] = None
    scan_confidence: Optional[float] = None
    scan_crop_stage: Optional[str] = None
    created_at: str
    messages: List[ConsultationMessageOut]


class ConsultationSummary(BaseModel):
    id: int
    status: str
    farmer_id: int
    farmer_name: Optional[str] = None
    farmer_region: Optional[str] = None
    officer_id: Optional[int] = None
    last_message: Optional[str] = None
    last_message_at: Optional[str] = None
    last_message_sender_role: Optional[str] = None
    scan_image_url: Optional[str] = None
    scan_pest_name: Optional[str] = None
    scan_confidence: Optional[float] = None
    scan_crop_stage: Optional[str] = None


class ConsultationListResponse(BaseModel):
    items: List[ConsultationSummary]
