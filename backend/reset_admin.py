from database import SessionLocal, engine, Base
from models import User

def reset_admin():
    """
    Delete existing admin user and create a new one with fresh credentials.
    """
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Delete existing admin user
        existing_admin = db.query(User).filter(User.admin_username == "admin").first()
        if existing_admin:
            db.delete(existing_admin)
            db.commit()
            print("Existing admin user deleted")

        # Create new admin user with pre-hashed password (bcrypt hash for "admin")
        # Generated with passlib: $2b$12$Azz0dWcbYNROG6MmSnu6vuzHhs1xI1lmiwkw1rCg47MtPXnG1K8Ju
        hashed_password = "$2b$12$Azz0dWcbYNROG6MmSnu6vuzHhs1xI1lmiwkw1rCg47MtPXnG1K8Ju"
        admin_user = User(
            phone_number="admin_admin",  # dummy phone number
            name="Administrator",
            email="admin@hadiyati.com",
            is_admin=True,
            role='Admin',
            admin_username="admin",
            admin_password_hash=hashed_password,
            is_verified=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("New admin user created successfully")
        print("Username: admin")
        print("Password: admin")

    except Exception as e:
        print(f"Error during admin reset: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Resetting admin account...")
    reset_admin()
    print("Admin reset completed!")