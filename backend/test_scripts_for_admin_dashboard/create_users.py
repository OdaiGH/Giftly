import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)
os.chdir(backend_dir)

from database import SessionLocal, engine, Base
from models import User
from datetime import date

def create_users():
    db = SessionLocal()
    try:
        # Define users to create
        users_data = [
            {
                "name": "Abdulrahman",
                "phone_number": "555025551",
                "email": "abdulrahman@example.com",
                "date_of_birth": date(1990, 1, 1),
                "role": "Customer"
            },
            {
                "name": "Mohanned",
                "phone_number": "553111551",
                "email": "mohanned@example.com",
                "date_of_birth": date(1990, 1, 2),
                "role": "Customer"
            },
            {
                "name": "Odai",
                "phone_number": "559644339",
                "email": "odai@example.com",
                "date_of_birth": date(1990, 1, 3),
                "role": "Customer"
            }
        ]

        for user_data in users_data:
            # Check if user already exists by phone number
            existing_user = db.query(User).filter(User.phone_number == user_data["phone_number"]).first()
            if existing_user:
                print(f"User with phone {user_data['phone_number']} already exists")
                continue

            # Create user
            user = User(
                name=user_data["name"],
                phone_number=user_data["phone_number"],
                email=user_data["email"],
                date_of_birth=user_data["date_of_birth"],
                role=user_data["role"],
                is_verified=True
            )
            db.add(user)
            print(f"Created user {user_data['name']} with phone {user_data['phone_number']}")

        db.commit()
        print("All users created successfully")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_users()