from pydantic import BaseModel, EmailStr, field_validator, model_validator
from datetime import datetime
from typing import Optional

MIN_AMOUNT_CENTS = 100
MAX_AMOUNT_CENTS = 10_000_000


class DonationCheckout(BaseModel):
    amount_cents: int
    donor_email: Optional[EmailStr] = None
    donor_name: Optional[str] = None
    is_recurring: bool = False
    dedication_note: Optional[str] = None

    @field_validator("amount_cents")
    @classmethod
    def validate_amount(cls, value: int) -> int:
        if value < MIN_AMOUNT_CENTS:
            raise ValueError("Minimum donation is $1.00")
        if value > MAX_AMOUNT_CENTS:
            raise ValueError("Donation amount exceeds the maximum allowed")
        return value

    @model_validator(mode="after")
    def require_email_for_recurring(self):
        if self.is_recurring and not self.donor_email:
            raise ValueError("Email is required for recurring donations")
        return self


class DonationVerifyResponse(BaseModel):
    amount_cents: int
    is_recurring: bool
    donor_email: Optional[str]
    status: str


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

