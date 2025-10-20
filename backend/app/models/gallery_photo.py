from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class GalleryPhoto(Base):
    __tablename__ = "gallery_photos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    uploader_name = Column(String, nullable=False)
    uploader_email = Column(String, nullable=False)
    s3_key = Column(String, nullable=False)
    approved = Column(Boolean, default=False)
    consent_signed = Column(Boolean, default=False, nullable=False)
    consent_ip = Column(String)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True))

