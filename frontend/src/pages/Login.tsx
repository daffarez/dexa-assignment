import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock as LockIcon,
  AlertTriangle,
  Loader2,
} from "lucide-react"; // Gunakan LockIcon agar tidak bentrok
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
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200 animate-in zoom-in duration-500">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight italic">
          PORTAL<span className="text-blue-600">KARWAYAN</span>
        </h2>
        <p className="mt-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
          Manajemen Kehadiran & Karyawan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] sm:px-10 border border-gray-100 mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-xs text-red-700 font-bold uppercase">
                  {error}
                </p>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider mb-1">
                Email Perusahaan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="anda@perusahaan.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-2xl shadow-lg shadow-blue-100 text-[11px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>Masuk Sekarang</>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          &copy; 2026 Daffarez Elguska.
        </p>
      </div>
    </div>
  );
}
