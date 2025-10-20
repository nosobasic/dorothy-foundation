from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EventCreate(BaseModel):
    title: str
    summary: Optional[str] = None
    description: Optional[str] = None
    start_at: datetime
    end_at: Optional[datetime] = None
    location: Optional[str] = None
    external_registration_url: Optional[str] = None
    is_published: bool = False


class EventUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    location: Optional[str] = None
    external_registration_url: Optional[str] = None
    is_published: Optional[bool] = None


class EventResponse(BaseModel):
    id: int
    title: str
    summary: Optional[str]
    description: Optional[str]
    start_at: datetime
    end_at: Optional[datetime]
    location: Optional[str]
    external_registration_url: Optional[str]
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True

