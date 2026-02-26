from typing import List
from pydantic import BaseModel


class PestCount(BaseModel):
    name: str
    count: int


class MonthlyUsers(BaseModel):
    month: str
    users: int


class RegionActivity(BaseModel):
    name: str
    intensity: str
    count: int


class AdminAnalyticsResponse(BaseModel):
    pest_counts: List[PestCount]
    registration_trend: List[MonthlyUsers]
    regions: List[RegionActivity]
    total_scans_this_month: int
    avg_response_hours: float
    ai_accuracy_rate: float
