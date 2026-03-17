"""
Authentication service untuk memvalidasi login dan membuat JWT token.
"""

from fastapi import HTTPException, status

from auth.jwt_handler import DEMO_USERS, create_access_token
from schemas.auth_schema import LoginRequest, TokenResponse


class AuthService:
    """Menangani logika otentikasi pengguna."""

    def login(self, request: LoginRequest) -> TokenResponse:
        """Memvalidasi kredensial pengguna dan menghasilkan JWT token."""

        user = DEMO_USERS.get(request.email)

        if not user or user["password"] != request.password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password tidak valid",
            )

        token = create_access_token(
            {
                "sub": user["email"],
                "name": user["name"],
                "role": user["role"],
            }
        )

        return TokenResponse(access_token=token)
