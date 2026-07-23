from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.company import Company
from app.models.user import User, UserRole
from app.core import security, jwt
from pydantic import BaseModel, EmailStr

router = APIRouter()

class SetupStatus(BaseModel):
    initialized: bool

class CompanySetupRequest(BaseModel):
    company_name: str
    company_email: EmailStr
    company_phone: str
    gst_number: str = None
    website: str = None
    address: str = None
    logo: str = None
    manager_first_name: str
    manager_last_name: str = None
    email: EmailStr
    phone: str = None
    password: str

@router.get("/status", response_model=SetupStatus)
def get_setup_status(db: Session = Depends(get_db)):
    # Initialize DB tables here for Serverless environments safely!
    # This guarantees tables are created in Vercel before we query them
    from app.db.base import Base
    from app.db.session import engine
    Base.metadata.create_all(bind=engine)
    
    # If any company exists, it's initialized
    company_exists = db.query(Company).first() is not None
    return SetupStatus(initialized=company_exists)

@router.post("/register-manager")
def register_manager(request: CompanySetupRequest, db: Session = Depends(get_db)):
    from app.db.base import Base
    from app.db.session import engine
    Base.metadata.create_all(bind=engine)
    
    if db.query(Company).first() is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CRM Already Initialized"
        )
    
    # Create Company
    company = Company(
        company_name=request.company_name,
        company_email=request.company_email,
        company_phone=request.company_phone,
        gst_number=request.gst_number,
        website=request.website,
        address=request.address,
        logo=request.logo
    )
    db.add(company)
    db.flush() # To get company.id
    
    # Create Super Manager
    user = User(
        full_name=f"{request.manager_first_name} {request.manager_last_name or ''}".strip(),
        email=request.email,
        phone=request.phone,
        password_hash=security.get_password_hash(request.password),
        role=UserRole.SUPER_MANAGER,
        department="Management",
        company_id=company.id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
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
