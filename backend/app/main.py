from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, events, donations, gallery, sponsors, contact

app = FastAPI(
    title="The Dorothy R. Morgan Foundation API",
    description="API for the TDRMF website",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(donations.router)
app.include_router(gallery.router)
app.include_router(sponsors.router)
app.include_router(contact.router)


@app.get("/")
def root():
    return {"message": "The Dorothy R. Morgan Foundation API"}


@app.get("/health")
def health():
    return {"status": "healthy"}

