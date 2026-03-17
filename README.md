# Mini AI Sales Prediction System

Aplikasi web full-stack untuk memprediksi status penjualan produk menggunakan Machine Learning (Random Forest Classifier).

---

## Cara Menjalankan Project

### Prasyarat

| Komponen | Versi Minimum |
| -------- | ------------- |
| Python   | 3.10+         |
| Node.js  | 18+           |
| pip      | terbaru       |

---

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API tersedia di: [http://localhost:8000](http://localhost:8000)

Dokumentasi interaktif: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Aplikasi tersedia di: [http://localhost:5173](http://localhost:5173)

---

### 3. Training Ulang Model (opsional)

Model sudah tersedia di `ml/model.pkl`. Untuk melatih ulang dari dataset:

```bash
python ml/training_model.py
```

Output model baru akan menggantikan `ml/model.pkl`.

---

### Kredensial Demo

| Field    | Nilai               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `admin123`          |

---

## Struktur Project

```
mini-ai-sales-predict-system/
├── backend/
│   ├── auth/                 # JWT handler & user store
│   ├── routers/              # Endpoint definitions (auth, sales, predict)
│   ├── schemas/              # Pydantic request/response models
│   ├── services/             # Business logic (auth, sales, ML)
│   ├── utils/                # App configuration (pydantic-settings)
│   └── main.py               # FastAPI entry point + CORS middleware
├── frontend/
│   └── src/
│       ├── components/       # StatsCard, SalesTable, PredictForm
│       ├── pages/            # LoginPage, DashboardPage
│       └── services/         # Axios API client
├── ml/
│   ├── training_model.py     # Training pipeline
│   └── model.pkl             # Trained model artifact
└── data/
    └── sales_data.csv        # Dataset sumber
```

---

## Design Decisions

- **FastAPI** digunakan karena ringan dan menyediakan dokumentasi otomatis
- **React + Vite** dipilih untuk pengembangan frontend yang cepat
- **Random Forest** digunakan karena cocok untuk data tabular sederhana
- Model disimpan bersama encoder untuk menjaga konsistensi prediksi

---

## Asumsi

- Sistem berjalan di lingkungan lokal
- Data berasal dari file CSV
- Status hanya terdiri dari **Laris / Tidak**
- Autentikasi masih menggunakan data statis (demo)

---

## Endpoint API

| Method | Path       | Auth | Deskripsi                                      |
| ------ | ---------- | ---- | ---------------------------------------------- |
| POST   | `/login`   | —    | Login, mendapat JWT token                      |
| GET    | `/sales`   | ✓    | Data penjualan (pagination: `limit`, `offset`) |
| POST   | `/predict` | ✓    | Prediksi status produk                         |
| GET    | `/`        | —    | Health check                                   |

---

## Author

Github: [https://github.com/aiimmm](https://github.com/aiimmm)

Website: [https://aiimmm.net](https://aiimmm.net)
