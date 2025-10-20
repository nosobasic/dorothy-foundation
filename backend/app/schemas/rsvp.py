from pydantic import BaseModel, EmailStr


class RSVPCreate(BaseModel):
    name: str
    email: EmailStr

