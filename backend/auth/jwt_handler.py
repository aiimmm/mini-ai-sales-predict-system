"""
JWT authentication module.
Menangani pembuatan token, verifikasi token, dan dependency FastAPI.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from utils.config import settings

# --- DEMO DATA USER ------------------------------
DEMO_USERS: dict[str, dict] = {
    "admin@gmail.com": {
        "email": "admin@gmail.com",
        "password": "admin123",
        "name": "System Admin",
        "role": "admin",
    }
}


# --- BEARER TOKEN SECURITY SCHEME ------------------------------
bearer_scheme = HTTPBearer(
    scheme_name="JWT Bearer Token",
    description="Gunakan token yang diperoleh dari endpoint /login",
)


# --- TOKEN CREATION ------------------------------
def create_access_token(
    payload: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Membuat dan mengembalikan JWT akses token."""

    token_data = payload.copy()
    expiry = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    token_data["exp"] = expiry

    return jwt.encode(token_data, settings.secret_key, algorithm=settings.algorithm)


# --- TOKEN VERIFICATION ------------------------------
def verify_token(token: str) -> dict:
    """Mendekode dan memverifikasi token JWT. Menghasilkan kode kesalahan 401 jika tidak valid atau kedaluwarsa."""

    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau sudah kadaluarsa",
            headers={"WWW-Authenticate": "Bearer"},
        )


# --- FASTAPI DEPENDENCY ------------------------------
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Dependensi FastAPI yang memvalidasi JWT dan mengembalikan payload pengguna saat ini."""

    return verify_token(credentials.credentials)
