import sys
import os
import argparse

# Add the parent directory to sys.path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def create_manager(email: str, password: str, full_name: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User with email {email} already exists.")
            return

        new_manager = User(
            email=email,
            password_hash=get_password_hash(password),
            full_name=full_name,
            role=UserRole.MANAGER,
            department="Executive",
            is_superuser=True,
        )
        db.add(new_manager)
        db.commit()
        print(f"Successfully created first Manager: {full_name} ({email})")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create the first Manager/CEO account.")
    parser.add_argument("--email", required=True, help="Manager email")
    parser.add_argument("--password", required=True, help="Manager password")
    parser.add_argument("--name", required=True, help="Manager full name")
    
    args = parser.parse_args()
    create_manager(args.email, args.password, args.name)
