from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.database import get_db
from app.models.donation import Donation
from app.models.user import User
from app.schemas.donation import DonationCheckout, DonationResponse, DonationStats
from app.services.auth import get_current_user
from app.services.webhooks.stripe_service import stripe_service
from app.services.webhooks.email_service import email_service
from app.core.config import settings
import stripe

router = APIRouter(prefix="/api/donations", tags=["donations"])


@router.post("/checkout")
async def create_checkout(donation_data: DonationCheckout, db: Session = Depends(get_db)):
    """Create Stripe payment intent or subscription"""
    
    if donation_data.is_recurring:
        # Create customer and subscription for recurring donations
        customer = stripe_service.create_customer(
            email=donation_data.donor_email,
            name=donation_data.donor_name
        )
        if not customer:
            raise HTTPException(status_code=500, detail="Failed to create customer")
        
        # Create price
        price = stripe_service.create_price(
            amount_cents=donation_data.amount_cents,
            recurring=True
        )
        if not price:
            raise HTTPException(status_code=500, detail="Failed to create price")
        
        # Create subscription
        subscription = stripe_service.create_subscription(
            customer_id=customer.id,
            price_id=price.id,
            metadata={
                "donor_name": donation_data.donor_name or "",
                "dedication": donation_data.dedication_note or ""
            }
        )
        if not subscription:
            raise HTTPException(status_code=500, detail="Failed to create subscription")
        
        # Store donation record
        donation = Donation(
            amount_cents=donation_data.amount_cents,
            donor_email=donation_data.donor_email,
            donor_name=donation_data.donor_name,
            stripe_subscription_id=subscription.id,
            is_recurring=True,
            dedication_note=donation_data.dedication_note,
            status="pending"
        )
        db.add(donation)
        db.commit()
        
        return {
            "client_secret": subscription.latest_invoice.payment_intent.client_secret,
            "subscription_id": subscription.id
        }
    else:
        # Create one-time payment intent
        intent = stripe_service.create_payment_intent(
            amount_cents=donation_data.amount_cents,
            metadata={
                "donor_email": donation_data.donor_email or "",
                "donor_name": donation_data.donor_name or "",
                "dedication": donation_data.dedication_note or ""
            }
        )
        if not intent:
            raise HTTPException(status_code=500, detail="Failed to create payment intent")
        
        # Store donation record
        donation = Donation(
            amount_cents=donation_data.amount_cents,
            donor_email=donation_data.donor_email,
            donor_name=donation_data.donor_name,
            stripe_payment_intent_id=intent.id,
            is_recurring=False,
            dedication_note=donation_data.dedication_note,
            status="pending"
        )
        db.add(donation)
        db.commit()
        
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id
        }


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    event = stripe_service.verify_webhook_signature(payload, sig_header)
    if not event:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle payment intent succeeded
    if event.type == "payment_intent.succeeded":
        payment_intent = event.data.object
        donation = db.query(Donation).filter(
            Donation.stripe_payment_intent_id == payment_intent.id
        ).first()
        
        if donation:
            donation.status = "succeeded"
            db.commit()
            
            # Send receipt email
            if donation.donor_email:
                await email_service.send_donation_receipt(
                    donation.donor_email,
                    donation.amount_cents / 100,
                    donation.id
                )
    
    # Handle subscription created
    elif event.type == "customer.subscription.created":
        subscription = event.data.object
        donation = db.query(Donation).filter(
            Donation.stripe_subscription_id == subscription.id
        ).first()
        
        if donation:
            donation.status = "succeeded"
            db.commit()
    
    return {"status": "success"}


@router.get("/stats", response_model=DonationStats)
def get_donation_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get donation statistics (admin only)"""
    total_amount = db.query(func.sum(Donation.amount_cents)).filter(
        Donation.status == "succeeded"
    ).scalar() or 0
    
    total_count = db.query(func.count(Donation.id)).filter(
        Donation.status == "succeeded"
    ).scalar() or 0
    
    recurring_count = db.query(func.count(Donation.id)).filter(
        Donation.status == "succeeded",
        Donation.is_recurring == True
    ).scalar() or 0
    
    return {
        "total_amount_cents": total_amount,
        "total_count": total_count,
        "recurring_count": recurring_count
    }


@router.get("/list", response_model=List[DonationResponse])
def list_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all donations (admin only)"""
    donations = db.query(Donation).order_by(Donation.created_at.desc()).all()
    return donations

