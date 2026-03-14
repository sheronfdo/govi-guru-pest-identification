from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import LoginRequest, Token, UserProfile, FarmerRegisterRequest, OfficerAccessRequest
from app.services.auth_service import AuthService
from app.core.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate(db, payload.identifier, payload.password, payload.role)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = AuthService.issue_token(user)
    return Token(access_token=token)


@router.post("/admin/login", response_model=Token)
def login_admin(payload: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate(db, payload.identifier, payload.password, "admin")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = AuthService.issue_token(user)
    return Token(access_token=token)


@router.post("/officer/login", response_model=Token)
def login_officer(payload: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate(db, payload.identifier, payload.password, "officer")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = AuthService.issue_token(user)
    return Token(access_token=token)


@router.post("/farmer/login", response_model=Token)
def login_farmer(payload: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate(db, payload.identifier, payload.password, "farmer")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = AuthService.issue_token(user)
    return Token(access_token=token)


@router.get("/me", response_model=UserProfile)
def me(current_user=Depends(get_current_user)):
    return current_user


@router.post("/farmers/register", response_model=UserProfile)
def register_farmer(payload: FarmerRegisterRequest, db: Session = Depends(get_db)):
    try:
        user = AuthService.register_farmer(
            db,
            payload.email,
            payload.phone,
            payload.password,
            payload.full_name,
            payload.region,
        )
        return user
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.post("/officers/request-access", response_model=UserProfile)
def request_officer_access(payload: OfficerAccessRequest, db: Session = Depends(get_db)):
    try:
        user = AuthService.request_officer_access(
            db,
            payload.full_name,
            payload.officer_id,
            payload.email,
            payload.region,
            payload.phone,
            payload.password,
        )
        return user
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))
