from sqladmin import Admin, ModelView
from database import engine
from models import User, City, Order, Invoice, Conversation, Message
from auth import verify_password
from sqlalchemy.orm import Session
from database import AsyncSessionLocal as SessionLocal
from fastapi import Request, HTTPException, status
import base64
from wtforms import DateField
from datetime import date

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.phone_number, User.email, User.name, User.date_of_birth, User.is_verified, User.otp, User.otp_created_at, User.is_admin, User.role, User.admin_username, User.admin_password_hash, User.city_id]
    column_searchable_list = [User.phone_number, User.email, User.name]
    column_filters = [User.is_verified, User.role, User.is_admin]
    form_columns = [User.phone_number, User.email, User.name, User.date_of_birth, User.is_verified, User.otp, User.is_admin, User.role, User.admin_username, User.admin_password_hash, User.city_id]

    column_choices = {
        User.role: {
            'Customer': 'Customer',
            'Admin': 'Admin',
            'Courier': 'Courier'
        }
    }

    form_overrides = {
        'date_of_birth': DateField
    }

    form_args = {
        'date_of_birth': {
            'format': '%Y-%m-%d'
        }
    }

class CityAdmin(ModelView, model=City):
    __name__ = "Cities"
    column_list = [City.id, City.name, City.icon, City.active]
    column_searchable_list = [City.name]
    column_filters = [City.active]
    form_columns = [City.name, City.icon, City.active]

class OrderAdmin(ModelView, model=Order):
    column_list = [Order.id, Order.order_id, Order.created_by_user_id, Order.assigned_to_user_id, Order.description, Order.creation_date, Order.delivery_date, Order.status, Order.comments, Order.updated_at, Order.city_id]
    column_searchable_list = [Order.order_id, Order.description]
    column_filters = [Order.status, Order.city_id]
    form_columns = [Order.order_id, Order.created_by_user_id, Order.assigned_to_user_id, Order.description, Order.delivery_date, Order.status, Order.comments, Order.city_id]

    column_choices = {
        Order.status: {
            'new': 'New',
            'received by courier': 'Received by Courier',
            'paid': 'Paid',
            'in progress to do': 'In Progress to Do',
            'cancelled': 'Cancelled',
            'done': 'Done',
            'in progress to deliver': 'In Progress to Deliver'
        }
    }

class InvoiceAdmin(ModelView, model=Invoice):
    column_list = [Invoice.id, Invoice.invoice_id, Invoice.order_id, Invoice.full_amount, Invoice.service_fee, Invoice.order_only_price, Invoice.courier_fee, Invoice.status, Invoice.description, Invoice.comment, Invoice.sent_to_user_via_email, Invoice.sent_at, Invoice.due_date, Invoice.tax_amount, Invoice.discount_amount, Invoice.created_at, Invoice.updated_at]
    column_searchable_list = [Invoice.invoice_id]
    column_filters = [Invoice.status, Invoice.sent_to_user_via_email]
    form_columns = [Invoice.invoice_id, Invoice.order_id, Invoice.full_amount, Invoice.service_fee, Invoice.order_only_price, Invoice.courier_fee, Invoice.status, Invoice.description, Invoice.comment, Invoice.sent_to_user_via_email, Invoice.sent_at, Invoice.due_date, Invoice.tax_amount, Invoice.discount_amount]

    column_choices = {
        Invoice.status: {
            'new': 'New',
            'paid': 'Paid',
            'cancelled': 'Cancelled',
            'refunded': 'Refunded',
            'other': 'Other'
        }
    }

class ConversationAdmin(ModelView, model=Conversation):
    column_list = [Conversation.id, Conversation.customer_id, Conversation.courier_id, Conversation.status, Conversation.created_at]
    column_searchable_list = [Conversation.customer_id, Conversation.courier_id]
    column_filters = [Conversation.status]
    form_columns = [Conversation.customer_id, Conversation.courier_id, Conversation.status]

    column_choices = {
        Conversation.status: {
            'active': 'Active',
            'inactive': 'Inactive',
            'closed': 'Closed'
        }
    }

class MessageAdmin(ModelView, model=Message):
    column_list = [Message.id, Message.conversation_id, Message.sender_id, Message.content, Message.sent_at, Message.message_type]
    column_searchable_list = [Message.content]
    column_filters = [Message.message_type, Message.conversation_id, Message.sender_id]
    form_columns = [Message.conversation_id, Message.sender_id, Message.content, Message.message_type, Message.invoice_description, Message.invoice_gift_price, Message.invoice_service_fee, Message.invoice_delivery_fee, Message.invoice_total]

    column_choices = {
        Message.message_type: {
            'text': 'Text',
            'invoice': 'Invoice'
        }
    }

def authenticate_admin_request(request: Request) -> bool:
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Basic "):
        return False

    try:
        encoded_credentials = auth_header.split(" ")[1]
        decoded_credentials = base64.b64decode(encoded_credentials).decode("utf-8")
        username, password = decoded_credentials.split(":", 1)

        db = SessionLocal()
        try:
            user = db.query(User).filter(User.admin_username == username, User.is_admin == True).first()
            if not user:
                return False
            return verify_password(password, user.admin_password_hash)
        finally:
            db.close()
    except:
        return False

# We'll create the admin instance in main.py after the app is created
