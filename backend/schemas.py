from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import date, datetime
import re

class SendOTP(BaseModel):
    phone_number: str

    @validator('phone_number')
    def validate_phone_number(cls, v):
        # Basic phone number validation (Saudi format)
        if not re.match(r'^(\+966|0)?[5][0-9]{8}$', v):
            raise ValueError('Invalid Saudi phone number format')
        return v

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
        return v

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

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone_number: Optional[str] = None
