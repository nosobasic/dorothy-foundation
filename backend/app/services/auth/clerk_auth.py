from dataclasses import dataclass
from typing import Any, Dict, Optional

import httpx
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

security = HTTPBearer(auto_error=False)


@dataclass
class ClerkAdmin:
    user_id: str
    email: Optional[str]
    public_metadata: Dict[str, Any]


def _get_clerk_client() -> Clerk:
    return Clerk(bearer_auth=settings.CLERK_SECRET_KEY)


def get_current_admin(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> ClerkAdmin:
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    httpx_request = httpx.Request(
        method=request.method,
        url=str(request.url),
        headers=dict(request.headers),
    )

    clerk = _get_clerk_client()
    request_state = clerk.authenticate_request(
        httpx_request,
        AuthenticateRequestOptions(
            secret_key=settings.CLERK_SECRET_KEY,
            accepts_token=["session_token"],
        ),
    )

    if not request_state.is_signed_in:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=request_state.reason or "Invalid session token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = request_state.payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = clerk.users.get(user_id=user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    public_metadata = user.public_metadata or {}
    if public_metadata.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    email = None
    if user.email_addresses:
        primary = next(
            (addr for addr in user.email_addresses if addr.id == user.primary_email_address_id),
            user.email_addresses[0],
        )
        email = primary.email_address if primary else None

    return ClerkAdmin(
        user_id=user_id,
        email=email,
        public_metadata=public_metadata,
    )
