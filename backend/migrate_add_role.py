from database import engine, SessionLocal
from models import User
from sqlalchemy import inspect, text, func
from sqlalchemy.exc import SQLAlchemyError

def migrate():
    """
    Migration script to add role column and email unique constraint to existing SQLite database.
    This uses raw SQL since SQLite doesn't support full ALTER for adding columns easily with SQLAlchemy create_all.
    """
    conn = engine.connect()
    db = SessionLocal()
    inspector = inspect(engine)
    
    try:
        # 1. Add role column if it doesn't exist
        columns = [c['name'] for c in inspector.get_columns('users')]
        if 'role' not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'Customer'"))
            print("Added role column with default 'Customer'")
        else:
            print("Role column already exists")
        
        # 2. Update roles for existing admin users
        db.execute(text("UPDATE users SET role = 'Admin' WHERE is_admin = 1"))
        db.commit()
        print("Updated role to 'Admin' for existing admin users")
        
        # 3. For email unique constraint
        indexes = [i['name'] for i in inspector.get_indexes('users')]
        if 'ix_users_email' not in indexes:
            # Check for duplicate emails first
            duplicate_result = db.execute(
                text("SELECT email, COUNT(*) FROM users WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1")
            ).fetchall()
            
            if duplicate_result:
                print("WARNING: Duplicate emails found. Cannot add unique constraint.")
                print("Duplicates:", [(email, count) for email, count in duplicate_result])
                print("Resolve duplicates manually (delete or update conflicting records), then rerun this script.")
                return
            
            # Add unique index
            conn.execute(text("CREATE UNIQUE INDEX ix_users_email ON users (email)"))
            print("Added unique constraint on email column")
        else:
            print("Email unique constraint already exists")
        
        # Verify
        print("Migration completed successfully!")
        print("All existing users now have roles (Customer by default, Admin for admins).")
        print("Email field is now unique.")
        
    except SQLAlchemyError as e:
        print(f"Database error during migration: {e}")
        db.rollback()
        conn.rollback()
    except Exception as e:
        print(f"Migration error: {e}")
        db.rollback()
        conn.rollback()
    finally:
        db.close()
        conn.close()

if __name__ == "__main__":
    print("Running migration for role column and email unique constraint...")
    migrate()
    print("\nMigration finished!")
    print("To apply: cd backend && python migrate_add_role.py")
    print("If duplicates exist, resolve them first or delete app.db and run python create_admin.py to recreate clean DB.")