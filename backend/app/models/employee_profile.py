import uuid
from sqlalchemy import Column, String, ForeignKey, Date, Float
from sqlalchemy.orm import relationship
from app.db.base import Base

class EmployeeProfile(Base):
    __tablename__ = "employee_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    dob = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    aadhaar = Column(String, nullable=True)
    pan = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    account_number = Column(String, nullable=True)
    ifsc = Column(String, nullable=True)
    joining_date = Column(Date, nullable=True)
    salary = Column(Float, nullable=True)
    employment_type = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)

    user = relationship("User", backref="profile")
