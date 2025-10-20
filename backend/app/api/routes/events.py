from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.database import get_db
from app.models.event import Event
from app.models.rsvp import RSVP
from app.models.user import User
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.schemas.rsvp import RSVPCreate
from app.services.auth import get_current_user

router = APIRouter(tags=["events"])


@router.get("/api/events", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    """Get all published upcoming events"""
    events = db.query(Event).filter(
        Event.is_published == True,
        Event.start_at >= datetime.utcnow()
    ).order_by(Event.start_at).all()
    return events


@router.get("/api/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get single event by ID"""
    event = db.query(Event).filter(Event.id == event_id, Event.is_published == True).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/api/events/{event_id}/rsvp", status_code=status.HTTP_201_CREATED)
def create_rsvp(event_id: int, rsvp_data: RSVPCreate, db: Session = Depends(get_db)):
    """Create RSVP for an event"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # If external URL, return it
    if event.external_registration_url:
        return {"external_url": event.external_registration_url}
    
    # Otherwise, store RSVP
    rsvp = RSVP(
        event_id=event_id,
        name=rsvp_data.name,
        email=rsvp_data.email
    )
    db.add(rsvp)
    db.commit()
    return {"message": "RSVP created successfully"}


# Admin routes
@router.post("/api/admin/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new event (admin only)"""
    event = Event(**event_data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/api/admin/events", response_model=List[EventResponse])
def get_all_events_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all events including unpublished (admin only)"""
    events = db.query(Event).order_by(Event.start_at.desc()).all()
    return events


@router.put("/api/admin/events/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update event (admin only)"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for key, value in event_data.model_dump(exclude_unset=True).items():
        setattr(event, key, value)
    
    db.commit()
    db.refresh(event)
    return event


@router.delete("/api/admin/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete event (admin only)"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return None

