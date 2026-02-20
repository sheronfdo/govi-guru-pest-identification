from fastapi import APIRouter

from app.api.routes import auth, health, admin_users, admin_pests, admin_pest_images

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(admin_users.router)
api_router.include_router(admin_pests.router)
api_router.include_router(admin_pest_images.router)
