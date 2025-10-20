from pydantic import BaseModel, EmailStr
from typing import Optional


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

