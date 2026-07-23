from fastapi import APIRouter
from app.api import auth, setup
from app.api.v1 import users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(setup.router, prefix="/setup", tags=["setup"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
