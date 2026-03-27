import {
  User,
  LogOut,
  Clock,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  LogIn as LogInIcon,
  LogOutIcon,
  PencilLine,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-100 text-center">
          <h1 className="text-2xl font-extrabold tracking-tighter text-black italic">
            DEXA<span className="text-blue-600">GROUP</span>
          </h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">
            Menu Utama
          </p>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-all">
            <User size={20} /> Profil Saya
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all">
            <Calendar size={20} /> Riwayat Absen
          </button>

          {user.role === "ADMIN" && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest px-4 mb-4">
                Administrator
              </p>
              <button
                onClick={() => navigate("/admin")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-bold hover:bg-purple-100 transition-all"
              >
                <ShieldCheck size={20} /> Admin Panel
              </button>
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Personal Dashboard
              </h2>
              <p className="text-gray-500 font-medium">
                Selamat bekerja, {user.name.split(" ")[0]}!
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Waktu Lokal
                </span>
                <span className="text-sm font-black text-gray-800">
                  {new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </span>
              </div>
              <Clock className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT COL: PROFILE INFO */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                {/* FOTO PROFIL (Sekarang Bersih Tanpa Ikon Gear/Pencil) */}
                <div className="mb-6">
                  <div className="w-32 h-32 rounded-full border-[6px] border-gray-50 shadow-inner overflow-hidden bg-gray-100">
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                </div>

                {/* NAMA & JABATAN */}
                <div className="text-center space-y-1 mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">
                    {user.role || "EMPLOYEE"}
                  </p>
                </div>

                {/* TOMBOL EDIT PROFILE (Sekarang Jelas & Tidak Ambigu) */}
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-gray-100"
                >
                  <PencilLine size={16} className="text-gray-400" />
                  Edit Profil
                </button>

                <div className="w-full grid grid-cols-1 gap-3 mt-8 pt-8 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Phone size={16} className="text-gray-400" />
                    <span>{user.phone || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: ATTENDANCE & SUMMARY (Requirement 1b & 1c) */}
            <div className="xl:col-span-2 space-y-8">
              {/* BUTTONS SECTION */}
              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                  Presensi Hari Ini
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button className="relative overflow-hidden group p-6 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all">
                    <div className="relative z-10 flex flex-col items-start gap-4">
                      <div className="p-3 bg-white/10 rounded-xl group-hover:bg-blue-600 transition-colors">
                        <LogInIcon size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black uppercase italic tracking-tighter">
                          Check In
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          Mulai Bekerja
                        </p>
                      </div>
                    </div>
                  </button>

                  <button className="relative overflow-hidden group p-6 bg-white border-2 border-dashed border-gray-200 text-gray-300 rounded-2xl hover:border-orange-500 hover:text-orange-500 transition-all cursor-not-allowed opacity-60">
                    <div className="relative z-10 flex flex-col items-start gap-4">
                      <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-orange-50 transition-colors">
                        <LogOutIcon size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black uppercase italic tracking-tighter">
                          Check Out
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          Selesai Bekerja
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* SUMMARY TABLE (Poin 29) */}
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <h3 className="text-lg font-black text-gray-900">
                    Rangkuman Bulan Ini
                  </h3>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-black transition-all shadow-sm">
                    Detail Riwayat
                  </button>
                </div>
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <Calendar size={32} className="text-blue-200" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm italic">
                    Belum ada aktivitas absensi tercatat untuk periode ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
