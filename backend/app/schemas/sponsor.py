from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any


class SponsorTierCreate(BaseModel):
    name: str
    amount_cents: int
    benefits_json: Optional[Dict[str, Any]] = None
    is_active: bool = True


class SponsorTierUpdate(BaseModel):
    name: Optional[str] = None
    amount_cents: Optional[int] = None
    benefits_json: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class SponsorTierResponse(BaseModel):
    id: int
    name: str
    amount_cents: int
    benefits_json: Optional[Dict[str, Any]]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

