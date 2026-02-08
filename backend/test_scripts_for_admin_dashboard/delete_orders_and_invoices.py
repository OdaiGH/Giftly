import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)
os.chdir(backend_dir)

import asyncio
from database import AsyncSessionLocal
from models import User, Order, Invoice
from sqlalchemy import select, delete

async def delete_orders_and_invoices():
    async with AsyncSessionLocal() as db:
        try:
            # Get users 2, 3, 4
            result = await db.execute(select(User).where(User.id.in_([2, 3, 4])))
            users = result.scalars().all()
            if len(users) != 3:
                print("Not all users found")
                return

            user_ids = [user.id for user in users]

            # First, get order IDs for these users
            result = await db.execute(select(Order.id).where(Order.created_by_user_id.in_(user_ids)))
            order_ids = [row[0] for row in result.fetchall()]

            if order_ids:
                # Delete invoices for these orders
                result = await db.execute(delete(Invoice).where(Invoice.order_id.in_(order_ids)))
                invoices_deleted = result.rowcount
                print(f"Deleted {invoices_deleted} invoices")

                # Then, delete orders created by these users
                result = await db.execute(delete(Order).where(Order.created_by_user_id.in_(user_ids)))
                orders_deleted = result.rowcount
                print(f"Deleted {orders_deleted} orders")

                await db.commit()
                print("Orders and invoices deleted successfully. Users kept.")
            else:
                print("No orders found to delete.")

        except Exception as e:
            print(f"Error: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(delete_orders_and_invoices())
