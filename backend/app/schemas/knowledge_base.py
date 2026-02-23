from typing import List, Optional
from pydantic import BaseModel


class KnowledgeArticleSummary(BaseModel):
    id: int
    title: str
    category: str
    status: str
    cover_image_url: Optional[str] = None
    views: int = 0
    updated_at: str


class KnowledgeArticleDetail(BaseModel):
    id: int
    title: str
    category: str
    content: str
    status: str
    cover_image_url: Optional[str] = None
    views: int = 0
    created_at: str
    updated_at: str


class KnowledgeArticleListResponse(BaseModel):
    items: List[KnowledgeArticleSummary]
