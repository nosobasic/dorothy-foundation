from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models.gallery_photo import GalleryPhoto
from app.models.user import User
from app.schemas.gallery import GalleryPhotoResponse, GalleryPhotoApprove
from app.services.auth import get_current_user
from app.services.storage.s3_service import s3_service

router = APIRouter(prefix="/api/gallery", tags=["gallery"])

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def validate_image_file(file: UploadFile) -> bool:
    """Validate image file type and size"""
    if not file.filename:
        return False
    
    ext = file.filename.split(".")[-1].lower()
    return ext in ALLOWED_EXTENSIONS


@router.get("", response_model=List[GalleryPhotoResponse])
def get_gallery_photos(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get approved gallery photos"""
    photos = db.query(GalleryPhoto).filter(
        GalleryPhoto.approved == True
    ).order_by(GalleryPhoto.submitted_at.desc()).offset(skip).limit(limit).all()
    
    # Add signed URLs
    result = []
    for photo in photos:
        photo_dict = GalleryPhotoResponse.model_validate(photo).model_dump()
        photo_dict["url"] = s3_service.get_signed_url(photo.s3_key) or ""
        result.append(GalleryPhotoResponse(**photo_dict))
    
    return result


@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_photo(
    request: Request,
    title: str = Form(...),
    uploader_name: str = Form(...),
    uploader_email: str = Form(...),
    description: Optional[str] = Form(None),
    consent_signed: bool = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Submit a photo to the gallery"""
    if not consent_signed:
        raise HTTPException(status_code=400, detail="Consent must be signed")
    
    if not validate_image_file(file):
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG and PNG allowed")
    
    # Read file
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB")
    
    # Generate unique S3 key
    ext = file.filename.split(".")[-1].lower()
    s3_key = f"gallery/{uuid.uuid4()}.{ext}"
    
    # Upload to S3
    content_type = file.content_type or "image/jpeg"
    success = s3_service.upload_file(content, s3_key, content_type)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to upload file")
    
    # Get IP address
    client_ip = request.client.host if request.client else None
    
    # Create database record
    photo = GalleryPhoto(
        title=title,
        description=description,
        uploader_name=uploader_name,
        uploader_email=uploader_email,
        s3_key=s3_key,
        consent_signed=consent_signed,
        consent_ip=client_ip,
        approved=False
    )
    db.add(photo)
    db.commit()
    
    return {"message": "Photo submitted successfully", "id": photo.id}


# Admin routes
@router.get("/admin/pending", response_model=List[GalleryPhotoResponse])
def get_pending_photos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get pending gallery photos (admin only)"""
    photos = db.query(GalleryPhoto).filter(
        GalleryPhoto.approved == False
    ).order_by(GalleryPhoto.submitted_at.desc()).all()
    
    # Add signed URLs
    result = []
    for photo in photos:
        photo_dict = GalleryPhotoResponse.model_validate(photo).model_dump()
        photo_dict["url"] = s3_service.get_signed_url(photo.s3_key) or ""
        result.append(GalleryPhotoResponse(**photo_dict))
    
    return result


@router.put("/admin/{photo_id}/approve", response_model=GalleryPhotoResponse)
def approve_photo(
    photo_id: int,
    approve_data: GalleryPhotoApprove,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Approve or reject a photo (admin only)"""
    photo = db.query(GalleryPhoto).filter(GalleryPhoto.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    photo.approved = approve_data.approved
    if approve_data.approved:
        photo.approved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(photo)
    
    photo_dict = GalleryPhotoResponse.model_validate(photo).model_dump()
    photo_dict["url"] = s3_service.get_signed_url(photo.s3_key) or ""
    return GalleryPhotoResponse(**photo_dict)


@router.delete("/admin/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a photo (admin only)"""
    photo = db.query(GalleryPhoto).filter(GalleryPhoto.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Delete from S3
    s3_service.delete_file(photo.s3_key)
    
    # Delete from database
    db.delete(photo)
    db.commit()
    return None

