from fastapi import APIRouter

from app.api.routes import auth, health, admin_users, admin_pests, admin_pest_images, farmer_scan, consultations, officer_farmers, officer_dashboard, knowledge_base

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(admin_users.router)
api_router.include_router(admin_pests.router)
api_router.include_router(admin_pest_images.router)
api_router.include_router(farmer_scan.router)
api_router.include_router(consultations.router)
api_router.include_router(officer_farmers.router)
api_router.include_router(officer_dashboard.router)
api_router.include_router(knowledge_base.router)
