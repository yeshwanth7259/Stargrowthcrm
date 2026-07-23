import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Company(Base):
    __tablename__ = "company"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    company_name = Column(String, nullable=False)
    company_email = Column(String, nullable=False)
    company_phone = Column(String, nullable=False)
    website = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    currency = Column(String, default="INR")
    timezone = Column(String, default="Asia/Kolkata")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
