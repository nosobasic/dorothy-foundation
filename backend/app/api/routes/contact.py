from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.contact_message import ContactMessage
from app.schemas.contact import ContactMessageCreate
from app.services.webhooks.email_service import email_service

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_contact_message(
    message_data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    """Submit contact form"""
    # Store message
    message = ContactMessage(**message_data.model_dump())
    db.add(message)
    db.commit()
    
    # Send email notification
    await email_service.send_contact_notification(
        name=message_data.name,
        email=message_data.email,
        subject=message_data.subject or "No subject",
        message=message_data.message
    )
    
    return {"message": "Message sent successfully"}

