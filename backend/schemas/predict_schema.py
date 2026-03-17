"""
Pydantic schemas untuk validasi request dan response ML prediction.
"""

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """Input yang dibutuhkan untuk prediksi produk.
    Nama kolom harus sama persis dengan kolom dataset pelatihan.
    """

    jumlah_penjualan: float = Field(..., ge=0, description="Jumlah unit terjual")
    harga: float = Field(..., gt=0, description="Harga produk dalam rupiah")
    diskon: float = Field(..., ge=0, le=100, description="Persentase diskon (0-100%)")


class PredictResponse(BaseModel):
    """Hasil prediksi yang dikembalikan oleh model ML."""

    status: str
    confidence: float
    probabilities: dict[str, float]
    input_features: dict
