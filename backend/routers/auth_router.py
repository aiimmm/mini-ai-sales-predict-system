"""
Authentication router - handle endpoint login
"""

from fastapi import APIRouter

from schemas.auth_schema import LoginRequest, TokenResponse
from services.auth_service import AuthService


router = APIRouter(prefix="/login", tags=["Authentication"])

_auth_service = AuthService()


@router.post(
    "",
    response_model=TokenResponse,
    summary="User login",
    description="Lakukan otentikasi dengan email dan password untuk menerima JWT akses token.",
)
def login(request: LoginRequest) -> TokenResponse:
    """Login endpoint - mengembalikan token JWT jika otentikasi berhasil."""
    return _auth_service.login(request)
