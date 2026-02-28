from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator
from datetime import datetime


class PestUpdate(BaseModel):
    name_en: Optional[str] = Field(default=None, min_length=2, max_length=255)
    name_si: Optional[str] = Field(default=None, max_length=255)
    name_ta: Optional[str] = Field(default=None, max_length=255)
    crop_stage: Optional[Literal["seedling", "vegetative", "reproductive", "ripening"]] = None
    chemical_methods: Optional[str] = Field(default=None, max_length=5000)
    kem_methods: Optional[str] = Field(default=None, max_length=5000)
    image_path: Optional[str] = None

    @field_validator("name_en", "name_si", "name_ta", "chemical_methods", "kem_methods")
    @classmethod
    def normalize_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None


class PestOut(BaseModel):
    id: int
    name_en: str
    name_si: Optional[str] = None
    name_ta: Optional[str] = None
    crop_stage: Optional[str] = None
    chemical_methods: Optional[str] = None
    kem_methods: Optional[str] = None
    image_path: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
