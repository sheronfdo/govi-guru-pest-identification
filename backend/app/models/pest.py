from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.db.base import Base


class Pest(Base):
    __tablename__ = "pests"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(255), nullable=False)
    name_si = Column(String(255), nullable=True)
    name_ta = Column(String(255), nullable=True)
    crop_stage = Column(String(64), nullable=True)
    chemical_methods = Column(Text, nullable=True)
    kem_methods = Column(Text, nullable=True)
    image_path = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
