from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import SendOTP, OTPVerify, Token, UpdateUserProfile
from auth import authenticate_user, create_access_token, generate_otp, get_user_by_phone, get_current_user
from config import settings

router = APIRouter()

@router.post("/send-otp", response_model=dict)
def send_otp(otp_request: SendOTP, db: Session = Depends(get_db)):
    phone_number = otp_request.phone_number
    user = get_user_by_phone(db, phone_number)

    otp = generate_otp()
    print(f"OTP for {phone_number}: {otp}")  # Log the OTP

    if user:
        # Invalidate previous OTP
        user.otp = None
        db.commit()
        # Set new OTP with timestamp
        user.otp = otp
        user.otp_created_at = datetime.utcnow()
        db.commit()
    else:
        # Create temp user with OTP
        user = User(phone_number=phone_number, otp=otp)
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"message": "OTP sent successfully", "otp": otp}

@router.post("/verify-otp", response_model=Token)
def verify_otp(otp_data: OTPVerify, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta

    user = get_user_by_phone(db, otp_data.phone_number)
    if not user:
        print(f"Error: User not found for phone {otp_data.phone_number}")
        raise HTTPException(status_code=400, detail="User not found")

    if not user.otp:
        print(f"Error: No OTP found for user {otp_data.phone_number}")
        raise HTTPException(status_code=400, detail="No OTP found")

    # Check if OTP is expired (90 seconds)
    if user.otp_created_at and datetime.utcnow() - user.otp_created_at > timedelta(seconds=90):
        print(f"Error: OTP expired for user {otp_data.phone_number}. Expected {user.otp}, got {otp_data.otp}")
        raise HTTPException(status_code=400, detail=f"OTP expired. Expected {user.otp}, got {otp_data.otp}")

    if user.otp != otp_data.otp:
        print(f"Error: Invalid OTP for user {otp_data.phone_number}. Expected {user.otp}, got {otp_data.otp}")
        raise HTTPException(status_code=400, detail=f"Invalid OTP. Expected {user.otp}, got {otp_data.otp}")

    user.otp = None  # Clear OTP
    
    if user.is_verified:
        # Existing user, login
        pass
    else:
        # New user, register
        if not otp_data.email or not otp_data.name or not otp_data.date_of_birth:
            raise HTTPException(status_code=400, detail="Registration details required for new user")
        
        # Check email uniqueness
        existing_email_user = db.query(User).filter(User.email == otp_data.email, User.id != user.id).first()
        if existing_email_user:
            raise HTTPException(status_code=400, detail="Email is already registered")
        
        user.email = otp_data.email
        user.name = otp_data.name
        user.date_of_birth = otp_data.date_of_birth
        user.is_verified = True
        user.role = 'Customer'
    
    db.commit()
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.phone_number}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=dict)
def get_current_user(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "phone_number": current_user.phone_number,
        "email": current_user.email,
        "name": current_user.name,
        "date_of_birth": current_user.date_of_birth.isoformat() if current_user.date_of_birth else None,
        "is_verified": current_user.is_verified,
        "role": current_user.role
    }

@router.put("/me", response_model=dict)
def update_current_user(user_update: UpdateUserProfile, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Update user fields
    if user_update.name is not None:
        current_user.name = user_update.name
    
    if user_update.email is not None:
        # Check email uniqueness
        existing_email_user = db.query(User).filter(User.email == user_update.email, User.id != current_user.id).first()
        if existing_email_user:
            raise HTTPException(status_code=400, detail="Email is already registered")
        current_user.email = user_update.email
    
    if user_update.date_of_birth is not None:
        current_user.date_of_birth = user_update.date_of_birth

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "phone_number": current_user.phone_number,
        "email": current_user.email,
        "name": current_user.name,
        "date_of_birth": current_user.date_of_birth.isoformat() if current_user.date_of_birth else None,
        "is_verified": current_user.is_verified
    }
