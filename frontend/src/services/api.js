// API module - Wrapper axios untuk komunikasi dengan backend FastAPI.

import axios from "axios";

// --- BASE CONFIG ------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR ------------------------------
// Menambahkan JWT token otomatis ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR ------------------------------
// Menangani error autentikasi global (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

// --- API FUNCTIONS ------------------------------
// Melakukan login menggunakan email dan password.
export function loginUser(email, password) {
  return apiClient.post("/login", { email, password });
}

// Mengambil data penjualan dengan pagination.
export function fetchSalesData(limit = 50, offset = 0) {
  return apiClient.get("/sales", { params: { limit, offset } });
}

// Mengirim data fitur ke backend untuk prediksi Machine Learning.
export function submitPrediction(jumlah_penjualan, harga, diskon) {
  return apiClient.post("/predict", { jumlah_penjualan, harga, diskon });
}

export default apiClient;
