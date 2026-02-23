from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_role
from app.core.storage import get_object_url, upload_image
from app.db.session import get_db
from app.models.knowledge_article import KnowledgeArticle
from app.schemas.knowledge_base import (
    KnowledgeArticleDetail,
    KnowledgeArticleListResponse,
    KnowledgeArticleSummary,
)

router = APIRouter(tags=["knowledge-base"])


def _format_dt(dt: Optional[datetime]) -> str:
    return dt.strftime("%d %b %Y %H:%M") if dt else datetime.utcnow().strftime("%d %b %Y %H:%M")


def _to_summary(article: KnowledgeArticle) -> KnowledgeArticleSummary:
    return KnowledgeArticleSummary(
        id=article.id,
        title=article.title,
        category=article.category,
        status=article.status,
        cover_image_url=article.cover_image_url,
        views=article.views or 0,
        updated_at=_format_dt(article.updated_at),
    )


def _to_detail(article: KnowledgeArticle) -> KnowledgeArticleDetail:
    return KnowledgeArticleDetail(
        id=article.id,
        title=article.title,
        category=article.category,
        content=article.content,
        status=article.status,
        cover_image_url=article.cover_image_url,
        views=article.views or 0,
        created_at=_format_dt(article.created_at),
        updated_at=_format_dt(article.updated_at),
    )


@router.get(
    "/officer/knowledge-base",
    response_model=KnowledgeArticleListResponse,
    dependencies=[Depends(require_role("officer"))],
)
def list_articles_officer(
    status_filter: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(KnowledgeArticle)
    if status_filter:
        query = query.filter(KnowledgeArticle.status == status_filter)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                KnowledgeArticle.title.ilike(like),
                KnowledgeArticle.category.ilike(like),
            )
        )
    articles = query.order_by(KnowledgeArticle.updated_at.desc()).all()
    return KnowledgeArticleListResponse(items=[_to_summary(a) for a in articles])


@router.post(
    "/officer/knowledge-base",
    response_model=KnowledgeArticleDetail,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("officer"))],
)
async def create_article(
    title: str = Form(...),
    category: str = Form(...),
    content: str = Form(...),
    status_value: str = Form("draft"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    status_norm = status_value.strip().lower()
    if status_norm not in {"draft", "published"}:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status")

    cover_url = None
    if image:
        content_bytes = await image.read()
        object_name = upload_image(image.filename, content_bytes, image.content_type)
        cover_url = get_object_url(object_name)

    article = KnowledgeArticle(
        title=title.strip(),
        category=category.strip(),
        content=content.strip(),
        status=status_norm,
        cover_image_url=cover_url,
        author_id=current_user.id,
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return _to_detail(article)


@router.patch(
    "/officer/knowledge-base/{article_id}",
    response_model=KnowledgeArticleDetail,
    dependencies=[Depends(require_role("officer"))],
)
async def update_article(
    article_id: int,
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    status_value: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    if status_value:
        status_norm = status_value.strip().lower()
        if status_norm not in {"draft", "published"}:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid status")
        article.status = status_norm
    if title is not None:
        article.title = title.strip()
    if category is not None:
        article.category = category.strip()
    if content is not None:
        article.content = content.strip()
    if image:
        content_bytes = await image.read()
        object_name = upload_image(image.filename, content_bytes, image.content_type)
        article.cover_image_url = get_object_url(object_name)

    db.commit()
    db.refresh(article)
    return _to_detail(article)


@router.get(
    "/officer/knowledge-base/{article_id}",
    response_model=KnowledgeArticleDetail,
    dependencies=[Depends(require_role("officer"))],
)
def article_detail_officer(
    article_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return _to_detail(article)


@router.get(
    "/farmer/knowledge-base",
    response_model=KnowledgeArticleListResponse,
    dependencies=[Depends(require_role("farmer"))],
)
def list_articles_farmer(
    q: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(KnowledgeArticle).filter(KnowledgeArticle.status == "published")
    if category:
        query = query.filter(KnowledgeArticle.category == category)
    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                KnowledgeArticle.title.ilike(like),
                KnowledgeArticle.category.ilike(like),
            )
        )
    articles = query.order_by(KnowledgeArticle.updated_at.desc()).all()
    return KnowledgeArticleListResponse(items=[_to_summary(a) for a in articles])


@router.get(
    "/farmer/knowledge-base/{article_id}",
    response_model=KnowledgeArticleDetail,
    dependencies=[Depends(require_role("farmer"))],
)
def article_detail_farmer(
    article_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    article = db.query(KnowledgeArticle).filter(
        KnowledgeArticle.id == article_id,
        KnowledgeArticle.status == "published",
    ).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    article.views = (article.views or 0) + 1
    db.commit()
    db.refresh(article)
    return _to_detail(article)
