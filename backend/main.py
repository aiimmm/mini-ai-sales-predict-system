"""
FastAPI application.
Mendaftarkan semua router dan mengkonfigurasi middleware global.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth_router, predict_router, sales_router
from utils.config import settings


app = FastAPI(
    title="Mini AI Sales Prediction System API",
    description="API untuk otentikasi, pengambilan data penjualan, dan prediksi produk berbasis Machine Learning.",
    version="1.0.0",
)

# --- CORS MIDDLEWARE ------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ------------------------------
app.include_router(auth_router.router)
app.include_router(sales_router.router)
app.include_router(predict_router.router)


# --- HEALTH CHECK ------------------------------
@app.get("/", tags=["Health"])
def health_check() -> dict:
    """Menampilkan informasi dan status layanan."""
    return {
        "service": "Mini AI Sales Prediction System API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }
