"""
ML Service untuk memuat model dan menjalankan prediksi.
Model dimuat menggunakan lazy loading (saat pertama kali digunakan).
"""

import os

import joblib
import pandas as pd
from fastapi import HTTPException, status

from schemas.predict_schema import PredictRequest, PredictResponse
from utils.config import settings


class MLService:
    """Menangani interferensi menggunakan model Random Forest yang telah dilatih."""

    def __init__(self) -> None:
        self._model_path = os.path.abspath(settings.ml_model_path)
        self._artifact = None

    # --- LAZY MODEL LOADING ------------------------------
    def _load_model(self) -> None:
        """Memuat model dari disk hanya sekali lalu menyimpannya di memory."""

        if self._artifact is not None:
            return

        if not os.path.exists(self._model_path):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"File model tidak ditemukan di: {self._model_path}",
            )

        try:
            self._artifact = joblib.load(self._model_path)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Gagal memuat model: {exc}",
            )

    # --- PREDICTION ------------------------------
    def predict(self, request: PredictRequest) -> PredictResponse:
        """Menjalankan prediksi menggunakan model yang sudah dilatih."""

        self._load_model()

        model = self._artifact["model_machine_learning"]
        encoder = self._artifact["label_encoder"]
        feature_names = self._artifact["daftar_fitur"]

        # Membuat DataFrame agar nama fitur sesuai saat training
        features_df = pd.DataFrame(
            [[request.jumlah_penjualan, request.harga, request.diskon]],
            columns=feature_names,
        )

        predicted_index = model.predict(features_df)[0]
        class_probabilities = model.predict_proba(features_df)[0]
        class_labels = encoder.inverse_transform(model.classes_)

        probability_map = {
            label: round(float(prob), 4)
            for label, prob in zip(class_labels, class_probabilities)
        }

        predicted_label = encoder.inverse_transform([predicted_index])[0]
        confidence = round(float(class_probabilities[predicted_index]), 4)

        return PredictResponse(
            status=predicted_label,
            confidence=confidence,
            probabilities=probability_map,
            input_features={
                "jumlah_penjualan": request.jumlah_penjualan,
                "harga": request.harga,
                "diskon": request.diskon,
            },
        )
