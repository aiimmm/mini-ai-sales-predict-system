import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PredictForm from "../components/PredictForm";
import SalesTable from "../components/SalesTable";
import StatsCard from "../components/StatsCard";
import { fetchSalesData } from "../services/api";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [salesData, setSalesData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSalesData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data } = await fetchSalesData(50, 0);
      setSalesData(data.data);
      setTotalRecords(data.total);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrorMessage(
          "Failed to load sales data. Make sure the backend is running on port 8000.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    loadSalesData();
  }, [loadSalesData, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Statistik yang diperoleh dari data yang sedang dimuat
  const totalPopular = salesData.filter((p) => p.status === "Laris").length;
  const totalUnpopular = salesData.filter((p) => p.status === "Tidak").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600">
              <span className="text-lg">📈</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">
                Sales AI Dashboard
              </h1>
              <p className="text-xs text-slate-500">Sales Prediction System</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={loadSalesData}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5
                         rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Reload data"
            >
              <span>↻</span> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5
                         rounded-lg hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Error banner */}
        {errorMessage && (
          <div
            className="flex items-start gap-3 px-4 py-3.5 bg-amber-950/40 border border-amber-800/60
                          text-amber-300 rounded-xl text-sm"
          >
            <span className="shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="font-semibold">Backend Connection Failed</p>
              <p className="text-xs text-amber-400 mt-0.5">{errorMessage}</p>
            </div>
            <button
              onClick={loadSalesData}
              className="ml-auto shrink-0 text-xs text-amber-400 hover:text-amber-200 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── STATS CARDS ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Total Products"
            value={totalRecords}
            textColor="text-white"
            icon="📦"
            isLoading={isLoading}
          />
          <StatsCard
            label="Popular Products (50 records)"
            value={totalPopular}
            textColor="text-emerald-400"
            icon="✅"
            isLoading={isLoading}
          />
          <StatsCard
            label="Unpopular Products (50 records)"
            value={totalUnpopular}
            textColor="text-red-400"
            icon="⚠️"
            isLoading={isLoading}
          />
        </div>

        {/* ── MAIN GRID ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <SalesTable
              salesData={salesData}
              totalRecords={totalRecords}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <PredictForm />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            Mini AI Sales Prediction System · Model: Random Forest
          </p>
        </div>
      </main>
    </div>
  );
}
