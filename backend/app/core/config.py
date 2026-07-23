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
    
    # Using Vercel Postgres if deployed, or SQLite for local rapid development
    SQLALCHEMY_DATABASE_URI: str = os.getenv("POSTGRES_URL") or os.getenv("DATABASE_URL") or "sqlite:///./stargrowth_crm.db"
    
    # Fix postgres:// to postgresql:// for SQLAlchemy compatibility
    @property
    def database_url(self) -> str:
        if self.SQLALCHEMY_DATABASE_URI and self.SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
            return self.SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
        return self.SQLALCHEMY_DATABASE_URI
        
    class Config:
        case_sensitive = True

settings = Settings()
