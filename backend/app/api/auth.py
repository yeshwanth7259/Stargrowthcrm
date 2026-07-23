from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.db.session import get_db
from app.models.user import User
from app.core import security, jwt

router = APIRouter()

class LoginRequest(BaseModel):
    department: str
    email: EmailStr
    password: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user or not security.verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
        
    # Department validation logic could go here depending on requirements
    # if user.department != request.department:
    #     raise HTTPException(status_code=403, detail="Invalid department")

    access_token = jwt.create_access_token(subject=user.id)
    refresh_token = jwt.create_refresh_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "name": user.full_name,
            "role": user.role,
            "department": user.department
        }
    }
