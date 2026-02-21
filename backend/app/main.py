from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import api_router
from app.db.session import engine
from app.db.base import Base
from app.services.auth_service import AuthService
from app.db.session import SessionLocal
from app.core.storage import ensure_bucket
from app import models  # noqa: F401


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix=settings.api_v1_prefix)
    ensure_bucket()

    @app.on_event("startup")
    def startup() -> None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            AuthService.ensure_default_admin(
                db, settings.default_admin_email, settings.default_admin_password
            )
        finally:
            db.close()

    return app


app = create_app()
