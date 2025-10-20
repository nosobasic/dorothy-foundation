from sqlalchemy import Column, Integer, String, JSON, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class SponsorTier(Base):
    __tablename__ = "sponsor_tiers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    amount_cents = Column(Integer, nullable=False)
    benefits_json = Column(JSON)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

