from fastapi import FastAPI, Request, HTTPException, status
from database import engine, Base
from routers import auth, admin, orders, cities, invoices
from sqladmin import Admin
from admin import UserAdmin, CityAdmin, OrderAdmin, InvoiceAdmin
import base64
import bcrypt
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from fastapi.responses import JSONResponse
import os

print(f"Current working directory: {os.getcwd()}")
print(f"Database URL: {engine.url}")

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(cities.router, prefix="/cities", tags=["cities"])
app.include_router(invoices.router, prefix="/invoices", tags=["invoices"])

# Middleware for admin authentication
@app.middleware("http")
async def admin_auth_middleware(request: Request, call_next):
    if request.url.path.startswith("/admin"):
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Basic "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Authentication required"},
                headers={"WWW-Authenticate": "Basic"}
            )

        try:
            encoded_credentials = auth_header.split(" ")[1]
            decoded_credentials = base64.b64decode(encoded_credentials).decode("utf-8")
            username, password = decoded_credentials.split(":", 1)

            db = SessionLocal()
            try:
                user = db.query(User).filter(
                    User.admin_username == username,
                    User.is_admin == True,
                    User.role == 'Admin'
                ).first()
                # Temporarily disable password check for testing
                # if not user or not bcrypt.checkpw(password.encode('utf-8'), user.admin_password_hash.encode('utf-8')):
                if not user:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "Invalid credentials"},
                        headers={"WWW-Authenticate": "Basic"}
                    )
            finally:
                db.close()
        except:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid credentials"},
                headers={"WWW-Authenticate": "Basic"}
            )

    response = await call_next(request)
    return response

# Force metadata refresh
from sqlalchemy import MetaData
metadata = MetaData()
metadata.reflect(bind=engine)

# Create and mount SQLAdmin
sqladmin = Admin(app, engine, title="Admin Dashboard")
sqladmin.add_view(UserAdmin)
sqladmin.add_view(CityAdmin)
sqladmin.add_view(OrderAdmin)
sqladmin.add_view(InvoiceAdmin)

@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}
