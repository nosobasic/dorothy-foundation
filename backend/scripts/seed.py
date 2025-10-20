#!/usr/bin/env python3
"""
Seed script for TDRMF database
Creates sample data for development and testing
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models.user import User
from app.models.event import Event
from app.models.sponsor_tier import SponsorTier
from app.models.gallery_photo import GalleryPhoto
from app.services.auth import get_password_hash


def seed_database():
    db = SessionLocal()
    try:
        # Create admin user
        print("Creating admin user...")
        admin = User(
            email="admin@tdrmf.org",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        print(f"✓ Admin user created: admin@tdrmf.org / admin123")

        # Create sample events
        print("\nCreating sample events...")
        events = [
            Event(
                title="Annual Memorial Gala",
                summary="Join us for our annual memorial gala honoring Dorothy R. Morgan and all those lost on 9/11.",
                description="An evening of remembrance, celebration, and community support. Includes dinner, silent auction, and memorial presentations.",
                start_at=datetime.now() + timedelta(days=30),
                end_at=datetime.now() + timedelta(days=30, hours=4),
                location="The Grand Ballroom, 456 Memorial Avenue, New York, NY",
                is_published=True
            ),
            Event(
                title="Youth Scholarship Application Workshop",
                summary="Learn how to apply for TDRMF youth scholarships and get help with your application.",
                description="Free workshop for students interested in applying for our scholarship program. Bring your questions and application materials.",
                start_at=datetime.now() + timedelta(days=15),
                end_at=datetime.now() + timedelta(days=15, hours=2),
                location="Community Center, 789 Hope Street, New York, NY",
                is_published=True
            ),
            Event(
                title="Volunteer Training Session",
                summary="Orientation for new volunteers joining the TDRMF team.",
                description="Learn about our mission, programs, and how you can contribute to our community.",
                start_at=datetime.now() + timedelta(days=45),
                end_at=datetime.now() + timedelta(days=45, hours=3),
                location="TDRMF Office",
                is_published=False
            )
        ]
        for event in events:
            db.add(event)
        db.commit()
        print(f"✓ Created {len(events)} sample events")

        # Create sponsor tiers
        print("\nCreating sponsor tiers...")
        tiers = [
            SponsorTier(
                name="Platinum Sponsor",
                amount_cents=50000,
                benefits_json={
                    "benefit1": "Logo on all event materials",
                    "benefit2": "Recognition in annual report",
                    "benefit3": "VIP table at gala (10 seats)",
                    "benefit4": "Dedicated social media post"
                },
                is_active=True
            ),
            SponsorTier(
                name="Gold Sponsor",
                amount_cents=25000,
                benefits_json={
                    "benefit1": "Logo on event materials",
                    "benefit2": "Recognition in annual report",
                    "benefit3": "Premium table at gala (8 seats)"
                },
                is_active=True
            ),
            SponsorTier(
                name="Silver Sponsor",
                amount_cents=10000,
                benefits_json={
                    "benefit1": "Name on event materials",
                    "benefit2": "Table at gala (6 seats)"
                },
                is_active=True
            )
        ]
        for tier in tiers:
            db.add(tier)
        db.commit()
        print(f"✓ Created {len(tiers)} sponsor tiers")

        # Create sample gallery photos (placeholders)
        print("\nCreating sample gallery photos...")
        photos = [
            GalleryPhoto(
                title="Community Gathering 2024",
                description="Beautiful moment from our spring community event",
                uploader_name="John Smith",
                uploader_email="john@example.com",
                s3_key="gallery/placeholder1.jpg",
                approved=True,
                consent_signed=True,
                consent_ip="127.0.0.1"
            ),
            GalleryPhoto(
                title="Youth Program Success",
                description="Students celebrating scholarship awards",
                uploader_name="Jane Doe",
                uploader_email="jane@example.com",
                s3_key="gallery/placeholder2.jpg",
                approved=True,
                consent_signed=True,
                consent_ip="127.0.0.1"
            ),
            GalleryPhoto(
                title="Memorial Service",
                description="Annual memorial service honoring Dorothy",
                uploader_name="Bob Johnson",
                uploader_email="bob@example.com",
                s3_key="gallery/placeholder3.jpg",
                approved=True,
                consent_signed=True,
                consent_ip="127.0.0.1"
            )
        ]
        for photo in photos:
            db.add(photo)
        db.commit()
        print(f"✓ Created {len(photos)} sample gallery photos")

        print("\n✅ Database seeded successfully!")
        print("\n📝 Important credentials:")
        print("   Admin login: admin@tdrmf.org")
        print("   Admin password: admin123")
        print("\n⚠️  Remember to change these credentials in production!")

    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

