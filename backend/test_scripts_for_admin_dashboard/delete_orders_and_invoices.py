from database import SessionLocal
from models import User, Order, Invoice

def delete_orders_and_invoices():
    db = SessionLocal()
    try:
        # Get users 2, 3, 4
        users = db.query(User).filter(User.id.in_([2, 3, 4])).all()
        if len(users) != 3:
            print("Not all users found")
            return

        user_ids = [user.id for user in users]

        # First, get order IDs for these users
        order_ids = db.query(Order.id).filter(Order.created_by_user_id.in_(user_ids)).subquery()

        # Delete invoices for these orders
        invoices_deleted = db.query(Invoice).filter(Invoice.order_id.in_(order_ids)).delete(synchronize_session=False)
        print(f"Deleted {invoices_deleted} invoices")

        # Then, delete orders created by these users
        orders_deleted = db.query(Order).filter(Order.created_by_user_id.in_(user_ids)).delete(synchronize_session=False)
        print(f"Deleted {orders_deleted} orders")

        db.commit()
        print("Orders and invoices deleted successfully. Users kept.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    delete_orders_and_invoices()