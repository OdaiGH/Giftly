from __future__ import annotations

from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import date, datetime
import re
from enum import Enum

class OrderStatusEnum(str, Enum):
    NEW = "new"
    RECEIVED_BY_COURIER = "received by courier"
    PAID = "paid"
    IN_PROGRESS_TO_DO = "in progress to do"
    CANCELLED = "cancelled"
    DONE = "done"
    IN_PROGRESS_TO_DELIVER = "in progress to deliver"

class InvoiceStatusEnum(str, Enum):
    NEW = "new"
    PAID = "paid"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    OTHER = "other"

class SendOTP(BaseModel):
    phone_number: str

    @validator('phone_number')
    def validate_phone_number(cls, v):
        # Basic phone number validation (Saudi format)
        if not re.match(r'^(\+966|0)?[5][0-9]{8}$', v):
            raise ValueError('Invalid Saudi phone number format')

        # Normalize phone number by removing leading zeros
        # Convert "0559644339" to "559644339"
        clean = re.sub(r'^(\+966|0)+', '', v)
        return clean

class OTPVerify(BaseModel):
    phone_number: str
    otp: str
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    date_of_birth: Optional[date] = None

    @validator('phone_number')
    def validate_phone_number(cls, v):
        if not re.match(r'^(\+966|0)?[5][0-9]{8}$', v):
            raise ValueError('Invalid Saudi phone number format')

        # Normalize phone number by removing leading zeros
        # Convert "0559644339" to "559644339"
        clean = re.sub(r'^(\+966|0)+', '', v)
        return clean

    @validator('otp')
    def validate_otp(cls, v):
        if not re.match(r'^\d{6}$', v):
            raise ValueError('OTP must be 6 digits')
        return v

    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            # Allow Arabic and English letters, spaces, minimum 2 characters
            if not re.match(r'^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s]{2,}$', v.strip()):
                raise ValueError('Name must contain only letters and spaces, minimum 2 characters')
            if len(v.strip()) < 2:
                raise ValueError('Name must be at least 2 characters long')
        return v

    @validator('date_of_birth')
    def validate_date_of_birth(cls, v):
        if v is not None:
            today = date.today()
            age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
            if age < 16:
                raise ValueError('User must be at least 16 years old')
            if v > today:
                raise ValueError('Date of birth cannot be in the future')
        return v

class UpdateUserProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None

    @validator('name')
    def validate_name(cls, v):
        if v is not None:
            if not re.match(r'^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s]{2,}$', v.strip()):
                raise ValueError('Name must contain only letters, numbers, and spaces, minimum 2 characters')
            if len(v.strip()) < 2:
                raise ValueError('Name must be at least 2 characters long')
        return v

    @validator('date_of_birth')
    def validate_date_of_birth(cls, v):
        if v is not None:
            today = date.today()
            age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
            if age < 16:
                raise ValueError('User must be at least 16 years old')
            if v > today:
                raise ValueError('Date of birth cannot be in the future')
        return v

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    needs_profile: bool = False

class TokenData(BaseModel):
    phone_number: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class CreateOrder(BaseModel):
    description: Optional[str] = None
    city_id: int
    delivery_date: datetime

    @validator('description')
    def validate_description(cls, v):
        if v is not None and len(v.strip()) == 0:
            return None  # Treat empty strings as None
        return v

class InvoiceResponse(BaseModel):
    id: int
    invoice_id: str
    order_id: int
    full_amount: int
    service_fee: int
    order_only_price: int
    courier_fee: int
    status: InvoiceStatusEnum
    description: Optional[str]
    comment: Optional[str]
    sent_to_user_via_email: bool
    sent_at: Optional[datetime]
    due_date: Optional[datetime]
    tax_amount: int
    discount_amount: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_id: str
    created_by_user_id: int
    assigned_to_user_id: Optional[int]
    description: Optional[str]
    creation_date: datetime
    delivery_date: Optional[datetime]
    status: OrderStatusEnum
    comments: Optional[str]
    updated_at: datetime
    city_id: int
    invoice: Optional[InvoiceResponse] = None  # Include invoice information

    class Config:
        from_attributes = True

class CityResponse(BaseModel):
    id: int
    name: str
    icon: Optional[str]
    active: bool

    class Config:
        from_attributes = True

class CreateInvoice(BaseModel):
    order_id: int
    full_amount: int
    service_fee: Optional[int] = 0
    order_only_price: int
    courier_fee: Optional[int] = 0
    description: Optional[str] = None
    comment: Optional[str] = None
    due_date: Optional[datetime] = None
    tax_amount: Optional[int] = 0
    discount_amount: Optional[int] = 0

class CancelOrderRequest(BaseModel):
    reason: str
