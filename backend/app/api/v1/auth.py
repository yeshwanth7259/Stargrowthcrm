from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any
from datetime import timedelta

from app.db.session import get_db
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse
from app.core import security
from app.core.config import settings
from app.api.deps import get_current_active_user

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

# Note: We'll move general register to user management endpoints for Manager only.
# But we need a one-time manager registration endpoint to bootstrap the system.

from app.models.user import UserRole

@router.post("/register-manager", response_model=UserResponse)
def register_manager(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    One-time endpoint to register the first Manager.
    If a manager already exists, it will throw an error.
    """
    # Check if ANY manager exists
    manager_exists = db.query(User).filter(User.role == UserRole.MANAGER).first()
    if manager_exists:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="A Manager already exists. Only one Manager can be registered this way.",
        )
    
    # Check if email is already taken just in case
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )
    
    user = User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=UserRole.MANAGER,
        department="Executive",
        is_superuser=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
