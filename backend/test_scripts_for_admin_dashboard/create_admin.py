import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)
os.chdir(backend_dir)

from database import SessionLocal, engine, Base
from models import User
from auth import get_password_hash

def create_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.admin_username == "admin").first()
        if existing_admin:
            print("Admin user already exists")
            return

        # Create admin user
        hashed_password = get_password_hash("admin")
        admin_user = User(
            phone_number="admin_admin",  # dummy phone number
            name="Administrator",
            is_admin=True,
            role='Admin',
            admin_username="admin",
            admin_password_hash=hashed_password,
            is_verified=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("Admin user created successfully")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
