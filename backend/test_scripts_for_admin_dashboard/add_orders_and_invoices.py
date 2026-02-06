import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)
os.chdir(backend_dir)

from database import SessionLocal, engine, Base
from models import User, Order, Invoice, City, OrderStatus, InvoiceStatus
import uuid
from datetime import datetime, timedelta

def add_orders_and_invoices():
    db = SessionLocal()
    try:
        # Ensure users 2, 3, 4 exist
        for user_id in [2, 3, 4]:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                user = User(
                    id=user_id,
                    phone_number=f"123456789{user_id}",
                    name=f"User {user_id}",
                    is_verified=True
                )
                db.add(user)
                print(f"Created user {user_id}")
        db.commit()

        # Get users 2, 3, 4
        users = db.query(User).filter(User.id.in_([2, 3, 4])).all()
        if len(users) != 3:
            print("Not all users found")
            return

        # Ensure city 1 exists
        city = db.query(City).filter(City.id == 1).first()
        if not city:
            city = City(id=1, name="Riyadh", icon="city", active=True)
            db.add(city)
            db.commit()
            print("Created city 1")

        order_counter = 1

        for user in users:
            print(f"Adding orders for user {user.id} ({user.name})")

            # Create 3 orders per user
            for i in range(3):
                # Sample data
                order_only_price = 200 + (i * 100)  # 200, 300, 400
                courier_fee = 50
                tax_amount = 20

                total_before_fee = order_only_price + courier_fee + tax_amount

                # Service fee: 30% if total > 500, else 20%
                if total_before_fee > 500:
                    service_fee_percent = 0.30
                else:
                    service_fee_percent = 0.20

                service_fee = int(total_before_fee * service_fee_percent)
                full_amount = total_before_fee + service_fee

                # Create order
                order = Order(
                    order_id=str(1000000 + order_counter),
                    created_by_user_id=user.id,
                    description=f"Sample order {i+1} for user {user.id}",
                    status=OrderStatus.NEW,
                    city_id=city.id
                )
                db.add(order)
                db.flush()  # To get order.id

                # Create invoice
                invoice = Invoice(
                    invoice_id=f"INV-{order_counter:06d}",
                    order_id=order.id,
                    full_amount=full_amount,
                    service_fee=service_fee,
                    order_only_price=order_only_price,
                    courier_fee=courier_fee,
                    tax_amount=tax_amount,
                    status=InvoiceStatus.NEW,
                    description=f"Invoice for order {order.order_id}"
                )
                db.add(invoice)

                print(f"  Created order {order.order_id} with invoice, full_amount: {full_amount}")
                order_counter += 1

        db.commit()
        print("All orders and invoices added successfully")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_orders_and_invoices()