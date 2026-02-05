from database import engine, SessionLocal
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError

def migrate():
    """
    Migration script to add refresh_token and refresh_token_expires_at columns to existing SQLite database.
    """
    conn = engine.connect()
    db = SessionLocal()
    inspector = inspect(engine)

    try:
        # Check existing columns
        columns = [c['name'] for c in inspector.get_columns('users')]

        # Add refresh_token column if it doesn't exist
        if 'refresh_token' not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN refresh_token VARCHAR"))
            print("Added refresh_token column")
        else:
            print("refresh_token column already exists")

        # Add refresh_token_expires_at column if it doesn't exist
        if 'refresh_token_expires_at' not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN refresh_token_expires_at DATETIME"))
            print("Added refresh_token_expires_at column")
        else:
            print("refresh_token_expires_at column already exists")

        # Verify
        print("Migration completed successfully!")
        print("Users table now has refresh_token and refresh_token_expires_at columns.")

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
    print("Running migration for refresh token columns...")
    migrate()
    print("\nMigration finished!")
    print("To apply: cd backend && python migrate_add_refresh_tokens.py")