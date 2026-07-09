from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.database import get_db
from app.models.donation import Donation
from app.schemas.donation import (
    DonationCheckout,
    DonationResponse,
    DonationStats,
    DonationVerifyResponse,
)
from app.services.auth import ClerkAdmin, get_current_admin
from app.services.webhooks.stripe_service import stripe_service
from app.services.webhooks.email_service import email_service
import stripe

router = APIRouter(prefix="/api/donations", tags=["donations"])


def _find_donation_by_payment_intent(db: Session, payment_intent_id: str) -> Donation | None:
    donation = db.query(Donation).filter(
        Donation.stripe_payment_intent_id == payment_intent_id
    ).first()
    if donation:
        return donation

    intent = stripe_service.retrieve_payment_intent(payment_intent_id)
    if not intent or not intent.invoice:
        return None

    invoice = stripe.Invoice.retrieve(intent.invoice)
    if not invoice.subscription:
        return None

    return db.query(Donation).filter(
        Donation.stripe_subscription_id == invoice.subscription
    ).first()


async def _mark_donation_succeeded(donation: Donation, db: Session) -> None:
    if donation.status == "succeeded":
        return

    donation.status = "succeeded"
    db.commit()

    if donation.donor_email:
        await email_service.send_donation_receipt(
            donation.donor_email,
            donation.amount_cents / 100,
            donation.id,
        )


@router.post("/checkout")
async def create_checkout(donation_data: DonationCheckout, db: Session = Depends(get_db)):
    """Create Stripe payment intent or subscription"""

    if donation_data.is_recurring:
        customer = stripe_service.create_customer(
            email=donation_data.donor_email,
            name=donation_data.donor_name,
        )
        if not customer:
            raise HTTPException(status_code=500, detail="Failed to create customer")

        price = stripe_service.create_price(
            amount_cents=donation_data.amount_cents,
            recurring=True,
        )
        if not price:
            raise HTTPException(status_code=500, detail="Failed to create price")

        subscription = stripe_service.create_subscription(
            customer_id=customer.id,
            price_id=price.id,
            metadata={
                "donor_name": donation_data.donor_name or "",
                "dedication": donation_data.dedication_note or "",
            },
        )
        if not subscription:
            raise HTTPException(status_code=500, detail="Failed to create subscription")

        payment_intent = subscription.latest_invoice.payment_intent
        if not payment_intent or not payment_intent.client_secret:
            raise HTTPException(status_code=500, detail="Failed to initialize subscription payment")

        donation = Donation(
            amount_cents=donation_data.amount_cents,
            donor_email=donation_data.donor_email,
            donor_name=donation_data.donor_name,
            stripe_payment_intent_id=payment_intent.id,
            stripe_subscription_id=subscription.id,
            is_recurring=True,
            dedication_note=donation_data.dedication_note,
            status="pending",
        )
        db.add(donation)
        db.commit()

        return {
            "client_secret": payment_intent.client_secret,
            "subscription_id": subscription.id,
        }

    intent = stripe_service.create_payment_intent(
        amount_cents=donation_data.amount_cents,
        metadata={
            "donor_email": donation_data.donor_email or "",
            "donor_name": donation_data.donor_name or "",
            "dedication": donation_data.dedication_note or "",
        },
    )
    if not intent:
        raise HTTPException(status_code=500, detail="Failed to create payment intent")

    donation = Donation(
        amount_cents=donation_data.amount_cents,
        donor_email=donation_data.donor_email,
        donor_name=donation_data.donor_name,
        stripe_payment_intent_id=intent.id,
        is_recurring=False,
        dedication_note=donation_data.dedication_note,
        status="pending",
    )
    db.add(donation)
    db.commit()

    return {
        "client_secret": intent.client_secret,
        "payment_intent_id": intent.id,
    }


@router.get("/verify", response_model=DonationVerifyResponse)
def verify_donation(payment_intent: str, db: Session = Depends(get_db)):
    """Verify a donation after Stripe redirect"""
    intent = stripe_service.retrieve_payment_intent(payment_intent)
    if not intent or intent.status != "succeeded":
        raise HTTPException(status_code=400, detail="Payment not completed")

    donation = _find_donation_by_payment_intent(db, payment_intent)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    return {
        "amount_cents": donation.amount_cents,
        "is_recurring": donation.is_recurring,
        "donor_email": donation.donor_email,
        "status": donation.status,
    }


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    event = stripe_service.verify_webhook_signature(payload, sig_header)
    if not event:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event.type == "payment_intent.succeeded":
        payment_intent = event.data.object
        donation = _find_donation_by_payment_intent(db, payment_intent.id)
        if donation:
            await _mark_donation_succeeded(donation, db)

    elif event.type == "payment_intent.payment_failed":
        payment_intent = event.data.object
        donation = _find_donation_by_payment_intent(db, payment_intent.id)
        if donation:
            donation.status = "failed"
            db.commit()

    elif event.type == "invoice.payment_succeeded":
        invoice = event.data.object
        if invoice.subscription and invoice.billing_reason == "subscription_create":
            donation = db.query(Donation).filter(
                Donation.stripe_subscription_id == invoice.subscription
            ).first()
            if donation:
                await _mark_donation_succeeded(donation, db)

    return {"status": "success"}


@router.get("/stats", response_model=DonationStats)
def get_donation_stats(
    db: Session = Depends(get_db),
    _admin: ClerkAdmin = Depends(get_current_admin),
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
        Donation.is_recurring == True,
    ).scalar() or 0

    return {
        "total_amount_cents": total_amount,
        "total_count": total_count,
        "recurring_count": recurring_count,
    }


@router.get("/list", response_model=List[DonationResponse])
def list_donations(
    db: Session = Depends(get_db),
    _admin: ClerkAdmin = Depends(get_current_admin),
):
    """List all donations (admin only)"""
    donations = db.query(Donation).order_by(Donation.created_at.desc()).all()
    return donations
