from pydantic import BaseModel, EmailStr, model_validator
from datetime import datetime
from typing import Optional


class DonationCheckout(BaseModel):
    amount_cents: int
    donor_email: Optional[EmailStr] = None
    donor_name: Optional[str] = None
    is_recurring: bool = False
    dedication_note: Optional[str] = None

    @model_validator(mode="after")
    def require_email_for_recurring(self):
        if self.is_recurring and not self.donor_email:
            raise ValueError("Email is required for recurring donations")
        return self


class DonationResponse(BaseModel):
    id: int
    amount_cents: int
    currency: str
    donor_email: Optional[str]
    donor_name: Optional[str]
    status: str
    is_recurring: bool
    dedication_note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class DonationStats(BaseModel):
    total_amount_cents: int
    total_count: int
    recurring_count: int

