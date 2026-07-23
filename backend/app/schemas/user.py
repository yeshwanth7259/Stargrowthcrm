from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date
from app.models.user import UserRole

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole = UserRole.EMPLOYEE
    department: Optional[str] = None
    designation: Optional[str] = None
    status: Optional[str] = "Active"
    profile_image: Optional[str] = None
    joining_date: Optional[date] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    status: Optional[str] = None
    profile_image: Optional[str] = None
    joining_date: Optional[date] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None

    class Config:
        from_attributes = True
