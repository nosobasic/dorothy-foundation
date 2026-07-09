from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./tdrmf.db"
    
    # Clerk
    CLERK_SECRET_KEY: str = "sk_test_placeholder"

    # Stripe
    STRIPE_SECRET_KEY: str = "sk_test_placeholder"
    STRIPE_WEBHOOK_SECRET: str = "whsec_placeholder"
    STRIPE_PUBLISHABLE_KEY: str = "pk_test_placeholder"
    
    # S3
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_REGION: str = "us-east-1"
    S3_BUCKET: str = "tdrmf-gallery"
    S3_ACCESS_KEY_ID: str = "minioadmin"
    S3_SECRET_ACCESS_KEY: str = "minioadmin"
    
    # SMTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "placeholder@example.com"
    SMTP_PASS: str = "placeholder"
    CONTACT_TO_EMAIL: str = "info@tdrmf.org"
    
    # CORS — comma-separated list of allowed frontend origins
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # Site
    SITE_URL: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

