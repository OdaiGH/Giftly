from database import SessionLocal
from models import User
import re

def normalize_phone_numbers():
    """
    Migration script to normalize phone numbers by removing leading zeros.
    Converts "0559644339" to "559644339"
    """
    db = SessionLocal()
    try:
        # Find all users with phone numbers starting with '0'
        users_with_zeros = db.query(User).filter(User.phone_number.like('0%')).all()

        updated_count = 0
        for user in users_with_zeros:
            original = user.phone_number
            # Remove leading zeros and +966 prefix
            normalized = re.sub(r'^(\+966|0)+', '', original)

            # Only update if the normalized version is different and valid
            if normalized != original and len(normalized) == 9 and normalized.startswith('5'):
                user.phone_number = normalized
                updated_count += 1
                print(f"Updated: {original} → {normalized}")

        if updated_count > 0:
            db.commit()
            print(f"Successfully normalized {updated_count} phone numbers")
        else:
            print("No phone numbers needed normalization")

        # Verify no duplicates were created
        phone_counts = db.query(User.phone_number, db.func.count(User.id)).group_by(User.phone_number).having(db.func.count(User.id) > 1).all()
        if phone_counts:
            print("WARNING: Duplicate phone numbers found after normalization:")
            for phone, count in phone_counts:
                print(f"  {phone}: {count} users")

    except Exception as e:
        print(f"Migration error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Normalizing phone numbers in database...")
    normalize_phone_numbers()
    print("Migration completed!")