from database import engine
from models import Base

def migrate():
    """
    Migration script to create JWT tokens table.
    """
    print("Creating JWT tokens table...")
    Base.metadata.create_all(bind=engine)
    print("JWT tokens table created successfully!")

if __name__ == "__main__":
    print("Running migration for JWT tokens table...")
    migrate()
    print("\nMigration finished!")
    print("To apply: cd backend && python migrate_add_jwt_tokens.py")