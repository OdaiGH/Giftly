from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Order, City, User, OrderStatus
from schemas import CreateOrder, OrderResponse, CancelOrderRequest
from auth import get_current_user

router = APIRouter()

@router.post("/", response_model=OrderResponse)
def create_order(order_data: CreateOrder, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Create a new order. Only authenticated users can create orders.
    City and delivery_date are mandatory, description is optional.
    """
    # Validate that city exists
    city = db.query(City).filter(City.id == order_data.city_id).first()
    if not city:
        raise HTTPException(status_code=400, detail="Invalid city ID")

    # Generate order_id
    max_id = db.query(func.max(Order.id)).scalar()
    if max_id is None:
        max_id = 0
    order_id = f"ORDR-{100000 + max_id + 1}"

    # Create the order
    new_order = Order(
        order_id=order_id,
        created_by_user_id=current_user.id,
        description=order_data.description,
        city_id=order_data.city_id,
        delivery_date=order_data.delivery_date,
        status=OrderStatus.NEW  # Default status
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order

@router.get("/", response_model=list[OrderResponse])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get all orders for the authenticated user.
    """
    orders = db.query(Order).filter(Order.created_by_user_id == current_user.id).all()

    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get a specific order by order_id. Only the user who created the order can access it.
    """
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.created_by_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this order")

    return order

@router.put("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: str, cancel_data: CancelOrderRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Cancel an order. Only the user who created the order can cancel it.
    """
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.created_by_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this order")

    # Check if order can be cancelled
    if order.status in [OrderStatus.CANCELLED, OrderStatus.DONE]:
        raise HTTPException(status_code=400, detail="Order cannot be cancelled")

    # Check if order has a paid invoice
    if order.invoice and order.invoice.status == "paid":
        raise HTTPException(status_code=400, detail="Order cannot be cancelled as it has a paid invoice. Please contact customer service.")

    # Update order
    order.status = OrderStatus.CANCELLED
    order.comments = f"{cancel_data.reason} by ID:{current_user.id} and name:{current_user.name}"
    # updated_at will be automatically updated due to onupdate=func.now()

    db.commit()
    db.refresh(order)

    return order
