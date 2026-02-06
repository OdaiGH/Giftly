from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Invoice, Order, InvoiceStatus
from schemas import CreateInvoice, InvoiceResponse
from auth import get_current_user
import uuid

router = APIRouter()

@router.post("/", response_model=InvoiceResponse)
def create_invoice(invoice_data: CreateInvoice, db: Session = Depends(get_db)):
    """
    Create a new invoice for an order. Admin only endpoint.
    """
    # Check if order exists
    order = db.query(Order).filter(Order.id == invoice_data.order_id).first()
    if not order:
        raise HTTPException(status_code=400, detail="Order not found")

    # Check if invoice already exists for this order
    existing_invoice = db.query(Invoice).filter(Invoice.order_id == invoice_data.order_id).first()
    if existing_invoice:
        raise HTTPException(status_code=400, detail="Invoice already exists for this order")

    # Generate unique invoice ID
    invoice_id = f"INV-{db.query(Invoice).count() + 1:06d}"

    # Create the invoice
    new_invoice = Invoice(
        invoice_id=invoice_id,
        order_id=invoice_data.order_id,
        full_amount=invoice_data.full_amount,
        service_fee=invoice_data.service_fee,
        order_only_price=invoice_data.order_only_price,
        courier_fee=invoice_data.courier_fee,
        description=invoice_data.description,
        comment=invoice_data.comment,
        due_date=invoice_data.due_date,
        tax_amount=invoice_data.tax_amount,
        discount_amount=invoice_data.discount_amount,
        status=InvoiceStatus.NEW
    )

    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)

    return new_invoice

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: str, db: Session = Depends(get_db)):
    """
    Get invoice by invoice_id. Public endpoint for viewing invoices.
    """
    invoice = db.query(Invoice).filter(Invoice.invoice_id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    return invoice

@router.get("/order/{order_id}", response_model=InvoiceResponse)
def get_invoice_by_order(order_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get invoice by order ID. Authenticated users can view their own invoices.
    """
    # Check if order exists and belongs to current user
    order = db.query(Order).filter(Order.id == order_id, Order.created_by_user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or access denied")

    invoice = db.query(Invoice).filter(Invoice.order_id == order_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found for this order")

    return invoice