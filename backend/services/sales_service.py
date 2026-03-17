"""
Sales service untuk membaca dan melakukan paginasi dataset penjualan dari file CSV.
"""

import os

import pandas as pd
from fastapi import HTTPException, status

from schemas.sales_schema import SalesListResponse, SalesRecord
from utils.config import settings


class SalesService:
    """Menangani pengambilan data penjualan dengan pagination."""

    def get_all(self, limit: int = 50, offset: int = 0) -> SalesListResponse:
        """Mengambil data penjualan dari dataset CSV."""

        dataset_path = os.path.abspath(settings.sales_dataset_path)

        if not os.path.exists(dataset_path):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"File dataset tidak ditemukan di: {dataset_path}",
            )

        try:
            df = pd.read_csv(dataset_path)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Gagal membaca dataset: {exc}",
            )

        total = len(df)
        current_page = offset // limit + 1 if limit else 1
        page_df = df.iloc[offset : offset + limit]

        records = [
            SalesRecord(
                product_id=str(row["product_id"]),
                product_name=str(row["product_name"]),
                sales_quantity=int(row["jumlah_penjualan"]),
                price=int(row["harga"]),
                discount=int(row["diskon"]),
                status=str(row["status"]).strip(),
            )
            for _, row in page_df.iterrows()
        ]

        return SalesListResponse(
            total=total,
            current_page=current_page,
            limit=limit,
            offset=offset,
            data=records,
        )
