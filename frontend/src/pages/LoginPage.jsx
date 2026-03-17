import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const DEMO_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "admin123",
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data } = await loginUser(email, password);
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-5 shadow-lg shadow-indigo-600/30">
            <span className="text-3xl">📈</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Sales AI
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Machine Learning Sales Prediction System
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">
            Sign in to Dashboard
          </h2>

          {/* Error banner */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-red-950/60 border border-red-800 text-red-300 rounded-lg text-sm">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm
                           placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           focus:border-transparent transition-all"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm
                           placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           focus:border-transparent transition-all"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-semibold text-sm rounded-lg
                         transition-colors shadow-lg shadow-indigo-600/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center mb-2">
              Demo credentials:
            </p>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-slate-800 rounded-lg text-center">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {DEMO_CREDENTIALS.email}
                </p>
              </div>
              <div className="flex-1 px-3 py-2 bg-slate-800 rounded-lg text-center">
                <p className="text-xs text-slate-500">Password</p>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {DEMO_CREDENTIALS.password}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
