import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)
os.chdir(backend_dir)

import asyncio
from database import AsyncSessionLocal, engine, Base
from models import User, Order, Invoice, City, OrderStatus, InvoiceStatus
import uuid
from datetime import datetime, timedelta
from sqlalchemy import select, update

async def add_orders_and_invoices():
    async with AsyncSessionLocal() as db:
        try:
            # Ensure users 2, 3, 4 exist
            for user_id in [2, 3, 4]:
                result = await db.execute(select(User).where(User.id == user_id))
                user = result.scalar_one_or_none()
                if not user:
                    user = User(
                        id=user_id,
                        phone_number=f"123456789{user_id}",
                        name=f"User {user_id}",
                        is_verified=True
                    )
                    db.add(user)
                    print(f"Created user {user_id}")
            await db.commit()

            # Get users 2, 3, 4
            result = await db.execute(select(User).where(User.id.in_([2, 3, 4])))
            users = result.scalars().all()
            if len(users) != 3:
                print("Not all users found")
                return

            # Ensure city 1 exists
            result = await db.execute(select(City).where(City.id == 1))
            city = result.scalar_one_or_none()
            if not city:
                city = City(id=1, name="Riyadh", icon="city", active=True)
                db.add(city)
                await db.commit()
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
                        order_id=f"ORDR-{100000 + order_counter}",
                        created_by_user_id=user.id,
                        assigned_to_user_id=5,
                        description=f"Sample order {i+1} for user {user.id}",
                        status=OrderStatus.RECEIVED_BY_COURIER,
                        city_id=city.id
                    )
                    db.add(order)
                    await db.flush()  # To get order.id

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

            await db.commit()
            print("All orders and invoices added successfully")

        except Exception as e:
            print(f"Error: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(add_orders_and_invoices())
