import {
  User,
  LogOut,
  Clock,
  Calendar,
  ShieldCheck,
  LogIn as LogInIcon,
  LogOutIcon,
  PencilLine,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { checkIn, checkOut, getMyAttendance } from "../services/attendance";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchAttendance();
  }, [navigate]);

  const fetchAttendance = async () => {
    try {
      const res = await getMyAttendance();

      console.log("Response Attendance:", res);

      const dataFromServer = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setLogs(dataFromServer);
    } catch (err) {
      console.error("Gagal mengambil riwayat absen", err);
      setLogs([]);
    }
  };

  const now = new Date();
  const todayDate = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const hasCheckedInToday = logs.some((l) => {
    const d = new Date(l.date);
    return (
      d.getDate() === todayDate &&
      d.getMonth() === todayMonth &&
      d.getFullYear() === todayYear &&
      l.status === "MASUK"
    );
  });

  const hasCheckedOutToday = logs.some((l) => {
    const d = new Date(l.date);
    return (
      d.getDate() === todayDate &&
      d.getMonth() === todayMonth &&
      d.getFullYear() === todayYear &&
      l.status === "PULANG"
    );
  });

  const handleAttendance = async (type: "IN" | "OUT") => {
    setLoading(true);
    try {
      if (type === "IN") await checkIn();
      else await checkOut();

      toast.success(`Berhasil Absen ${type === "IN" ? "Masuk" : "Pulang"}`);
      fetchAttendance();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal melakukan absen");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* SIDEBAR */}
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold">
            <User size={20} /> Profil Saya
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all">
            <Calendar size={20} /> Riwayat Absen
          </button>
          {user.role === "ADMIN" && (
            <div className="pt-6 mt-6 border-t border-gray-100">
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
              <span className="text-sm font-black text-gray-800">
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </span>
              <Clock className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT: PROFILE */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="mb-6 w-32 h-32 rounded-full border-[6px] border-gray-50 shadow-inner overflow-hidden bg-gray-100">
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
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-blue-600 font-bold text-xs mb-6 uppercase tracking-wider">
                  {user.role}
                </p>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-gray-100"
                >
                  <PencilLine size={16} /> Edit Profil
                </button>
              </div>
            </div>

            {/* RIGHT: ATTENDANCE */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>{" "}
                  Presensi Hari Ini
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Tombol Check In */}
                  <button
                    onClick={() => handleAttendance("IN")}
                    disabled={hasCheckedInToday || loading}
                    className={`relative overflow-hidden group p-6 rounded-2xl transition-all ${
                      hasCheckedInToday
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-black"
                    }`}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${hasCheckedInToday ? "bg-gray-200" : "bg-white/10 group-hover:bg-blue-600"}`}
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={28} />
                        ) : (
                          <LogInIcon size={28} />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black uppercase italic tracking-tighter">
                          Check In
                        </p>
                        <p className="text-[10px] font-bold uppercase">
                          {hasCheckedInToday ? "Selesai" : "Mulai Bekerja"}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Tombol Check Out */}
                  <button
                    onClick={() => handleAttendance("OUT")}
                    disabled={
                      !hasCheckedInToday || hasCheckedOutToday || loading
                    }
                    className={`relative overflow-hidden group p-6 rounded-2xl transition-all border-2 border-dashed ${
                      !hasCheckedInToday || hasCheckedOutToday
                        ? "border-gray-200 text-gray-300 opacity-60 cursor-not-allowed"
                        : "border-orange-500 text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${!hasCheckedInToday || hasCheckedOutToday ? "bg-gray-50" : "bg-orange-100 group-hover:bg-orange-200"}`}
                      >
                        <LogOutIcon size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black uppercase italic tracking-tighter">
                          Check Out
                        </p>
                        <p className="text-[10px] font-bold uppercase">
                          {hasCheckedOutToday ? "Selesai" : "Selesai Bekerja"}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* SUMMARY LIST */}
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <h3 className="text-lg font-black text-gray-900">
                    Aktivitas Terkini
                  </h3>
                </div>
                <div className="p-6">
                  {logs.length === 0 ? (
                    <div className="p-12 text-center space-y-4">
                      <Calendar size={32} className="text-gray-200 mx-auto" />
                      <p className="text-gray-400 font-bold text-sm italic">
                        Belum ada aktivitas tercatat.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {logs.slice(0, 5).map((log, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-lg ${log.status === "MASUK" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              {log.status === "MASUK" ? (
                                <LogInIcon size={18} />
                              ) : (
                                <LogOutIcon size={18} />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {log.status}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">
                                {new Date(log.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-black text-gray-700">
                            {new Date(log.time).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            WIB
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
