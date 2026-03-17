"""
Pydantic schemas untuk validasi request dan response autentikasi.
"""

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Request body untuk POST /login."""

    email: str = Field(..., example="admin@gmail.com")
    password: str = Field(..., example="admin123")


class TokenResponse(BaseModel):
    """Response body yang dikembalikan setelah login berhasil."""

    access_token: str
    token_type: str = "bearer"
    message: str = "Login berhasil"
