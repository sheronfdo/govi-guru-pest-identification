from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class PestUpdate(BaseModel):
    name_en: Optional[str] = None
    name_si: Optional[str] = None
    name_ta: Optional[str] = None
    crop_stage: Optional[str] = None
    chemical_methods: Optional[str] = None
    kem_methods: Optional[str] = None
    image_path: Optional[str] = None


class PestOut(BaseModel):
    id: int
    name_en: str
    name_si: Optional[str] = None
    name_ta: Optional[str] = None
    crop_stage: Optional[str] = None
    chemical_methods: Optional[str] = None
    kem_methods: Optional[str] = None
    image_path: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
