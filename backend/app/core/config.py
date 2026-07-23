import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Star Growth Hub CRM"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # 15 minutes
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7 days
    
    # Using SQLite for local rapid development (No Docker required)
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./stargrowth_crm.db"
        
    class Config:
        case_sensitive = True

settings = Settings()
