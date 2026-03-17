"""
Prediction router - handle endpoint prediksi Machine Learning.
"""

from fastapi import APIRouter, Depends

from auth.jwt_handler import get_current_user
from schemas.predict_schema import PredictRequest, PredictResponse
from services.ml_service import MLService


router = APIRouter(prefix="/predict", tags=["Machine Learning Prediction"])

_ml_service = MLService()


@router.post(
    "",
    response_model=PredictResponse,
    summary="Predict product status",
    description="Memprediksi apakah produk Laris atau Tidak menggunakan model Machine Learning.",
)
def predict_product_status(
    request: PredictRequest,
    current_user: dict = Depends(get_current_user),
) -> PredictResponse:
    """Menjalankan prediksi ML untuk fitur produk yang diberikan."""
    return _ml_service.predict(request)
