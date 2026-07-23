import uuid
import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserRole(str, enum.Enum):
    SUPER_MANAGER = "SUPER_MANAGER"
    MANAGER = "MANAGER"
    ACCOUNTANT = "ACCOUNTANT"
    EMPLOYEE = "EMPLOYEE"
    CLIENT = "CLIENT"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_code = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE, nullable=False)
    designation = Column(String, nullable=True)
    department = Column(String, nullable=True)
    status = Column(String, default="Active")
    
    company_id = Column(String, ForeignKey("company.id"), nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
