from typing import List, Optional
from pydantic import BaseModel


class PestDetectionResult(BaseModel):
    id: int
    name: str
    scientific_name: Optional[str] = None
    image_url: Optional[str] = None
    confidence: float
    traditional_methods: List[str]
    chemical_methods: List[str]


class ScanResponse(BaseModel):
    pest: PestDetectionResult
