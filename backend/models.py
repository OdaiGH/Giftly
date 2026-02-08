from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text, Enum, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum

class OrderStatus(enum.Enum):
    NEW = "new"
    RECEIVED_BY_COURIER = "received by courier"
    PAID = "paid"
    IN_PROGRESS_TO_DO = "in progress to do"
    CANCELLED = "cancelled"
    DONE = "done"
    IN_PROGRESS_TO_DELIVER = "in progress to deliver"

class InvoiceStatus(enum.Enum):
    NEW = "new"
    PAID = "paid"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    OTHER = "other"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    def __str__(self):
        return f"{self.name or 'No Name'} ({self.phone_number})"
    phone_number = Column(String, unique=True, index=True)
    email = Column(String, unique=True, nullable=True)
    name = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    is_verified = Column(Boolean, default=False)
    otp = Column(String, nullable=True)
    otp_created_at = Column(DateTime, default=func.now())
    is_admin = Column(Boolean, default=False)
    role = Column(String, default='Customer')
    admin_username = Column(String, unique=True, nullable=True)
    admin_password_hash = Column(String, nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)

    # Relationship to JWT tokens
    jwt_tokens = relationship("JWTToken", back_populates="user", cascade="all, delete-orphan")
    # Relationship to city
    city = relationship("City", back_populates="users")
    # Relationship to orders created by user
    created_orders = relationship("Order", back_populates="created_by_user", foreign_keys="Order.created_by_user_id")
    # Relationship to orders assigned to user
    assigned_orders = relationship("Order", back_populates="assigned_to_user", foreign_keys="Order.assigned_to_user_id")

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    def __str__(self):
        return self.name
    icon = Column(String, nullable=True)
    active = Column(Boolean, default=True)

    # Relationship to users
    users = relationship("User", back_populates="city")
    # Relationship to orders
    orders = relationship("Order", back_populates="city")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, nullable=False, unique=True)

    def __str__(self):
        return f"Order {self.order_id}"
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    description = Column(Text, nullable=True)
    creation_date = Column(DateTime, default=func.now(), nullable=False)
    delivery_date = Column(DateTime, nullable=True)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.NEW)
    comments = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)

    # Relationships
    created_by_user = relationship("User", back_populates="created_orders", foreign_keys=[created_by_user_id])
    assigned_to_user = relationship("User", back_populates="assigned_orders", foreign_keys=[assigned_to_user_id])
    city = relationship("City", back_populates="orders")
    # Relationship to invoice
    invoice = relationship("Invoice", back_populates="order", uselist=False)

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(String, unique=True, nullable=False, index=True)

    def __str__(self):
        return f"Invoice {self.invoice_id}"
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    full_amount = Column(Integer, nullable=False)  # Amount in cents/halaym
    service_fee = Column(Integer, nullable=False, default=0)
    order_only_price = Column(Integer, nullable=False)
    courier_fee = Column(Integer, nullable=False, default=0)
    status = Column(Enum(InvoiceStatus), nullable=False, default=InvoiceStatus.NEW)
    description = Column(Text, nullable=True)
    comment = Column(Text, nullable=True)
    sent_to_user_via_email = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    tax_amount = Column(Integer, nullable=False, default=0)
    discount_amount = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    order = relationship("Order", back_populates="invoice")

class JWTToken(Base):
    __tablename__ = "jwt_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    access_token = Column(String, unique=True, nullable=False, index=True)
    refresh_token = Column(String, unique=True, nullable=False, index=True)
    access_token_expires_at = Column(DateTime, nullable=False)
    refresh_token_expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    # Relationship back to user
    user = relationship("User", back_populates="jwt_tokens")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    courier_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(20), nullable=False, default='active')
    created_at = Column(DateTime(timezone=True), nullable=False, default=func.now())

    # Relationships
    customer = relationship("User", foreign_keys=[customer_id])
    courier = relationship("User", foreign_keys=[courier_id])
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint('customer_id', 'courier_id', name='unique_customer_courier'),
    )

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=False, default=func.now())
    message_type = Column(String(20), nullable=False, default='text')  # 'text' or 'invoice'
    # Invoice specific fields
    invoice_description = Column(Text, nullable=True)
    invoice_gift_price = Column(Integer, nullable=True)  # in cents/halaym
    invoice_service_fee = Column(Integer, nullable=True)
    invoice_delivery_fee = Column(Integer, nullable=True)
    invoice_total = Column(Integer, nullable=True)

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")
