from database import SessionLocal
from models import Order, Invoice

def verify():
    db = SessionLocal()
    try:
        orders = db.query(Order).limit(5).all()
        print("Orders:")
        for order in orders:
            print(f"  {order.id}: {order.order_id}")

        invoices = db.query(Invoice).limit(5).all()
        print("\nInvoices:")
        for invoice in invoices:
            print(f"  {invoice.id}: {invoice.invoice_id}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify()