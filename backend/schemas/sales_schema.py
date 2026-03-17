"""
Pydantic schemas unuk validasi request dan response data sales.
"""

from pydantic import BaseModel


class SalesRecord(BaseModel):
    """Satu record data penjualan."""

    product_id: str
    product_name: str
    sales_quantity: int
    price: int
    discount: int
    status: str


class SalesListResponse(BaseModel):
    """Response daftar catatan penjualan (pagination)."""

    total: int
    current_page: int
    limit: int
    offset: int
    data: list[SalesRecord]
