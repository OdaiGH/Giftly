from database import SessionLocal
from models import User

def migrate_admin_roles():
    """
    Migration script to ensure all admin users have the correct role.
    """
    db = SessionLocal()
    try:
        # Update all admin users to have 'Admin' role
        admins_updated = db.query(User).filter(
            User.is_admin == True,
            User.role != 'Admin'
        ).update({"role": 'Admin'})

        db.commit()
        print(f"Updated {admins_updated} admin user(s) with correct role")

        # Verify admin users
        admin_count = db.query(User).filter(User.is_admin == True).count()
        print(f"Total admin users in database: {admin_count}")

    except Exception as e:
        print(f"Migration error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Running migration for admin roles...")
    migrate_admin_roles()
    print("Migration completed!")