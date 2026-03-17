"""
Konfigurasi aplikasi menggunakan pydantic-settings.
"""

import os
from pydantic import ConfigDict
from pydantic_settings import BaseSettings


# --- PROJECT ROOT PATH ------------------------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))


class Settings(BaseSettings):
    """Pengaturan aplikasi yang dapat diambil dari file .env."""

    # model_config = ConfigDict(
    #     env_file=".env",
    #     extra="ignore",
    # )

    # --- JWT CONFIGURATION ------------------------------
    secret_key: str = "replace-with-a-strong-secret-key-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # --- FILE PATHS ------------------------------
    sales_dataset_path: str = os.path.join(PROJECT_ROOT, "data", "sales_data.csv")
    ml_model_path: str = os.path.join(PROJECT_ROOT, "ml", "model.pkl")

    # --- CORS ORIGINS ------------------------------
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


# Pengaturan di seluruh aplikasi
settings = Settings()
