from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.sponsor_tier import SponsorTier
from app.models.user import User
from app.schemas.sponsor import SponsorTierCreate, SponsorTierUpdate, SponsorTierResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/sponsors", tags=["sponsors"])


@router.get("", response_model=List[SponsorTierResponse])
def get_sponsor_tiers(db: Session = Depends(get_db)):
    """Get all active sponsor tiers"""
    tiers = db.query(SponsorTier).filter(
        SponsorTier.is_active == True
    ).order_by(SponsorTier.amount_cents.desc()).all()
    return tiers


# Admin routes
@router.post("/admin", response_model=SponsorTierResponse, status_code=status.HTTP_201_CREATED)
def create_sponsor_tier(
    tier_data: SponsorTierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create sponsor tier (admin only)"""
    tier = SponsorTier(**tier_data.model_dump())
    db.add(tier)
    db.commit()
    db.refresh(tier)
    return tier


@router.get("/admin", response_model=List[SponsorTierResponse])
def get_all_sponsor_tiers_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all sponsor tiers including inactive (admin only)"""
    tiers = db.query(SponsorTier).order_by(SponsorTier.amount_cents.desc()).all()
    return tiers


@router.put("/admin/{tier_id}", response_model=SponsorTierResponse)
def update_sponsor_tier(
    tier_id: int,
    tier_data: SponsorTierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update sponsor tier (admin only)"""
    tier = db.query(SponsorTier).filter(SponsorTier.id == tier_id).first()
    if not tier:
        raise HTTPException(status_code=404, detail="Sponsor tier not found")
    
    for key, value in tier_data.model_dump(exclude_unset=True).items():
        setattr(tier, key, value)
    
    db.commit()
    db.refresh(tier)
    return tier


@router.delete("/admin/{tier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sponsor_tier(
    tier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete sponsor tier (admin only)"""
    tier = db.query(SponsorTier).filter(SponsorTier.id == tier_id).first()
    if not tier:
        raise HTTPException(status_code=404, detail="Sponsor tier not found")
    
    db.delete(tier)
    db.commit()
    return None

