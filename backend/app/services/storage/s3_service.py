import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from typing import Optional
from app.core.config import settings


class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=settings.S3_ENDPOINT,
            aws_access_key_id=settings.S3_ACCESS_KEY_ID,
            aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
            region_name=settings.S3_REGION,
            config=Config(signature_version='s3v4')
        )
        self.bucket = settings.S3_BUCKET

    def upload_file(self, file_content: bytes, key: str, content_type: str) -> bool:
        """Upload file to S3"""
        try:
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file_content,
                ContentType=content_type
            )
            return True
        except ClientError as e:
            print(f"Error uploading file: {e}")
            return False

    def get_signed_url(self, key: str, expiration: int = 3600) -> Optional[str]:
        """Generate a signed URL for accessing a file"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': key},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            print(f"Error generating signed URL: {e}")
            return None

    def delete_file(self, key: str) -> bool:
        """Delete file from S3"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError as e:
            print(f"Error deleting file: {e}")
            return False


s3_service = S3Service()

