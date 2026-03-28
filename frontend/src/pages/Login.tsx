import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { login } from "../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginResponse = await login({ email, password });
      const userToken = loginResponse.access_token;

      localStorage.setItem("token", userToken);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* HEADER LOGO/JUDUL */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-black flex items-center justify-center shadow-lg">
          <LogIn className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
          HRIS Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Silakan masuk ke akun Anda untuk melanjutkan.
        </p>
      </div>

      {/* KARTU FORM LOGIN */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-100 rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* ALERT ERROR */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* INPUT EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Perusahaan
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-black focus:border-black sm:text-sm transition-colors"
                  placeholder="anda@perusahaan.com"
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-black focus:border-black sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* FITUR TAMBAHAN (Lupa Password/Remember Me) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Lupa password?
                </a>
              </div>
            </div>

            {/* TOMBOL SUBMIT */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Masuk Portal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER KECIL */}
        <p className="mt-8 text-center text-xs text-gray-400">
          &copy; 2026 PT. Perusahaan Anda. All rights reserved.
        </p>
      </div>
    </div>
  );
}
