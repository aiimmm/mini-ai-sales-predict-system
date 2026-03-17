"""
Sales router — handle endpoint data penjualan.
"""

from fastapi import APIRouter, Depends, Query

from auth.jwt_handler import get_current_user
from schemas.sales_schema import SalesListResponse
from services.sales_service import SalesService


router = APIRouter(prefix="/sales", tags=["Sales Data"])

_sales_service = SalesService()


@router.get(
    "",
    response_model=SalesListResponse,
    summary="Get sales data",
    description="Mengambil daftar catatan penjualan produk yang dipagination.",
)
def get_sales(
    limit: int = Query(50, ge=1, le=500, description="Jumlah data per halaman"),
    offset: int = Query(0, ge=0, description="Posisi awal data untuk pagination"),
    current_user: dict = Depends(get_current_user),
) -> SalesListResponse:
    """Menampilkan data penjualan yang dipaginasi."""
    return _sales_service.get_all(limit=limit, offset=offset)
