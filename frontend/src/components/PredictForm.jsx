import { useState } from "react";
import { submitPrediction } from "../services/api";

// --- CONSTANTS ------------------------------
const INITIAL_FORM_STATE = {
  jumlah_penjualan: "",
  harga: "",
  diskon: "",
};

const RESULT_DISPLAY_CONFIG = {
  Laris: {
    containerClass: "bg-emerald-950/60 border-emerald-700/60",
    labelClass: "text-emerald-300",
    icon: "✅",
    message: "This product is predicted to sell well.",
  },
  Tidak: {
    containerClass: "bg-red-950/60 border-red-700/60",
    labelClass: "text-red-300",
    icon: "⚠️",
    message: "This product is predicted to have low market demand.",
  },
};

const FORM_FIELDS = [
  {
    key: "jumlah_penjualan",
    label: "Jumlah Penjualan",
    placeholder: "Contoh: 150",
    hint: "Unit yang terjual",
    min: 0,
    step: 1,
  },
  {
    key: "harga",
    label: "Harga Produk (Rp)",
    placeholder: "Contoh: 75000",
    hint: "Harga satuan dalam rupiah",
    min: 1,
    step: 1000,
  },
  {
    key: "diskon",
    label: "Diskon (%)",
    placeholder: "Contoh: 10",
    hint: "Persentase diskon (0–100)",
    min: 0,
    max: 100,
    step: 5,
  },
];

// --- HELPERS ------------------------------
function formatFeatureValue(key, value) {
  if (key === "harga") return `Rp${value.toLocaleString("id-ID")}`;
  if (key === "diskon") return `${value}%`;
  return value;
}

function formatFeatureLabel(key) {
  return key.replace(/_/g, " ");
}

// --- COMPONENT ------------------------------
export default function PredictForm() {
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setPrediction(null);

    try {
      const { data } = await submitPrediction(
        Number(formValues.jumlah_penjualan),
        Number(formValues.harga),
        Number(formValues.diskon),
      );
      setPrediction(data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setErrorMessage(
        Array.isArray(detail)
          ? detail.map((item) => item.msg).join(", ")
          : detail || "Prediksi gagal. Pastikan backend berjalan di port 8000.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormValues(INITIAL_FORM_STATE);
    setPrediction(null);
    setErrorMessage("");
  };

  const displayConfig = prediction
    ? RESULT_DISPLAY_CONFIG[prediction.status]
    : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-white flex items-center gap-2">
          <span>🤖</span> AI Prediction
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Masukkan data produk untuk prediksi status penjualan
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {FORM_FIELDS.map(
          ({ key, label, placeholder, hint, min, max, step }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                {label}
              </label>
              <input
                type="number"
                name={key}
                value={formValues[key]}
                onChange={handleChange}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                required
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm placeholder-slate-600
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         transition-all [appearance:textfield]
                         [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none"
              />
              <p className="text-xs text-slate-600 mt-1">{hint}</p>
            </div>
          ),
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-semibold text-sm rounded-lg
                       transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Memproses...
              </>
            ) : (
              "Prediksi"
            )}
          </button>

          {(prediction || errorMessage) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400
                         hover:text-white text-sm rounded-lg transition-colors"
              title="Reset form"
            >
              ↺
            </button>
          )}
        </div>
      </form>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-950/60 border border-red-800 text-red-300 rounded-lg text-sm">
          <span className="shrink-0 mt-0.5">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Prediction result */}
      {prediction && displayConfig && (
        <div
          className={`p-4 rounded-xl border ${displayConfig.containerClass}`}
        >
          {/* Result header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Hasil Prediksi
            </p>
            <span className="text-xs text-slate-500">
              {(prediction.confidence * 100).toFixed(1)}% yakin
            </span>
          </div>

          {/* Status label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{displayConfig.icon}</span>
            <div>
              <p className={`text-2xl font-bold ${displayConfig.labelClass}`}>
                {prediction.status}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {displayConfig.message}
              </p>
            </div>
          </div>

          {/* Probability distribution */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Distribusi Probabilitas
            </p>
            {Object.entries(prediction.probabilities).map(([label, prob]) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{label}</span>
                  <span className="text-slate-400 tabular-nums">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      label === "Laris" ? "bg-emerald-400" : "bg-red-400"
                    }`}
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Input summary */}
          <div className="mt-4 pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 mb-2">Input yang digunakan:</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(prediction.input_features).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-slate-800/60 rounded-lg px-2.5 py-2 text-center"
                >
                  <p className="text-xs text-slate-500 leading-tight">
                    {formatFeatureLabel(key)}
                  </p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5 tabular-nums">
                    {formatFeatureValue(key, value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
