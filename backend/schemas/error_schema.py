"""
Pydantic schema untuk error response API.
"""

from typing import Optional
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """Standard error response format."""

    detail: str
    code: Optional[int] = None
