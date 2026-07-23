from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import hashlib

def _pre_hash(password: str) -> str:
    # Hash password with SHA-256 to ensure it is always 64 bytes (hex digest)
    # This prevents the bcrypt 72-byte limit error entirely
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(_pre_hash(plain_password), hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(_pre_hash(password))
