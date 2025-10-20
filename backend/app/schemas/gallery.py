from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class GalleryPhotoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    uploader_name: str
    uploader_email: EmailStr
    consent_signed: bool


class GalleryPhotoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    uploader_name: str
    uploader_email: str
    s3_key: str
    url: str
    approved: bool
    submitted_at: datetime

    class Config:
        from_attributes = True


class GalleryPhotoApprove(BaseModel):
    approved: bool

