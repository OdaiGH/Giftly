from sqladmin import Admin, ModelView
from database import engine
from models import User
from auth import verify_password
from sqlalchemy.orm import Session
from database import SessionLocal
from fastapi import Request, HTTPException, status
import base64

from sqladmin import ModelView
from models import User
from wtforms import DateField
from datetime import date

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.phone_number, User.email, User.name, User.date_of_birth, User.is_verified, User.role, User.is_admin]
    column_searchable_list = [User.phone_number, User.email, User.name]
    column_filters = [User.is_verified, User.role, User.is_admin]
    form_columns = [User.phone_number, User.email, User.name, User.date_of_birth, User.is_verified, User.role, User.is_admin]

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
