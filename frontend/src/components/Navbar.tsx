import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Calendar, ShieldCheck, LogOut, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import { getProfileFromToken } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  let user: any = null;

  if (token) {
    try {
      user = getProfileFromToken(token);
    } catch (e) {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Berhasil keluar");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
            navigate(user.role === "ADMIN" ? "/admin" : "/dashboard")
          }
        >
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
            <span className="text-white font-black italic text-lg">D</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tighter text-black italic">
            PORTAL<span className="text-blue-600">KARYAWAN</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-100">
          <button
            onClick={() => navigate("/dashboard?tab=PROFILE")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              location.pathname === "/dashboard" &&
              (searchParams.get("tab") === "PROFILE" ||
                !searchParams.get("tab"))
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid size={14} /> Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard?tab=HISTORY")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              searchParams.get("tab") === "HISTORY"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Calendar size={14} /> Riwayat
          </button>

          {user.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                isActive("/admin") || isActive("/register")
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-100"
                  : "text-gray-400 hover:text-purple-600"
              }`}
            >
              <ShieldCheck size={14} /> Admin Panel
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-gray-900">{user.name}</p>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter italic">
              {user.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 group"
          >
            <LogOut
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
