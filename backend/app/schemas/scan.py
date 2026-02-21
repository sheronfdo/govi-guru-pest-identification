from typing import List, Optional
from pydantic import BaseModel


class PestDetectionResult(BaseModel):
    id: int
    name: str
    scientific_name: Optional[str] = None
    image_url: Optional[str] = None
    crop_stage: Optional[str] = None
    confidence: float
    traditional_methods: List[str]
    chemical_methods: List[str]


class ScanResponse(BaseModel):
    scan_id: int
    scan_image_url: Optional[str] = None
    pest: PestDetectionResult


class ScanHistoryItem(BaseModel):
    id: int
    date: str
    pest_name: str
    status: str
    image_url: Optional[str] = None


class ScanHistoryResponse(BaseModel):
    items: List[ScanHistoryItem]


class ScanDetailResponse(BaseModel):
    id: int
    date: str
    status: str
    image_url: Optional[str] = None
    pest: PestDetectionResult
