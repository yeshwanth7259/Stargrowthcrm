import hashlib
import bcrypt

def _pre_hash(password: str) -> str:
    # Hash password with SHA-256 to ensure it is always 64 bytes (hex digest)
    # This prevents the bcrypt 72-byte limit error entirely
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            _pre_hash(plain_password).encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except ValueError:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(_pre_hash(password).encode('utf-8'), salt)
    return hashed.decode('utf-8')
