from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    amount_cents = Column(Integer, nullable=False)
    currency = Column(String, default="usd", nullable=False)
    donor_email = Column(String)
    donor_name = Column(String)
    stripe_payment_intent_id = Column(String, unique=True)
    stripe_subscription_id = Column(String)
    status = Column(String, default="pending")  # pending, succeeded, failed
    is_recurring = Column(Boolean, default=False)
    dedication_note = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

