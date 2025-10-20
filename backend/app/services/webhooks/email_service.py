import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


class EmailService:
    @staticmethod
    async def send_email(to_email: str, subject: str, body: str, html_body: str = None):
        """Send an email via SMTP"""
        message = MIMEMultipart("alternative")
        message["From"] = settings.SMTP_USER
        message["To"] = to_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "plain"))
        if html_body:
            message.attach(MIMEText(html_body, "html"))

        try:
            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASS,
                start_tls=True,
            )
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    @staticmethod
    async def send_contact_notification(name: str, email: str, subject: str, message: str):
        """Send contact form notification to foundation"""
        body = f"""
New contact form submission:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""
        await EmailService.send_email(
            settings.CONTACT_TO_EMAIL,
            f"Contact Form: {subject}",
            body
        )

    @staticmethod
    async def send_donation_receipt(donor_email: str, amount: float, donation_id: int):
        """Send donation receipt to donor"""
        body = f"""
Thank you for your generous donation to The Dorothy R. Morgan Foundation!

Donation Details:
Amount: ${amount:.2f}
Transaction ID: {donation_id}
Date: {datetime.now().strftime('%B %d, %Y')}

Your donation supports families, healing, and youth programs in honor of Dorothy R. Morgan.

From Loss to Light.

The Dorothy R. Morgan Foundation
Tax ID: [501(c)(3) Application Pending]
"""
        await EmailService.send_email(
            donor_email,
            "Thank You for Your Donation",
            body
        )


from datetime import datetime

email_service = EmailService()

