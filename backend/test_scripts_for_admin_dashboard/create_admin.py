import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)
os.chdir(backend_dir)

import asyncio
from database import AsyncSessionLocal, engine, Base
from models import User
from auth import get_password_hash
from sqlalchemy import select

async def create_admin():
    async with AsyncSessionLocal() as db:
        try:
            # Check if admin already exists
            result = await db.execute(select(User).where(User.admin_username == "admin"))
            existing_admin = result.scalar_one_or_none()
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
            await db.commit()
            await db.refresh(admin_user)
            print("Admin user created successfully")
        except Exception as e:
            print(f"Error: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(create_admin())
