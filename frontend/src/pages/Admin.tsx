import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { getUsers } from "../services/user";
import { toast, Toaster } from "react-hot-toast";
import { Bell, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers();
        // Sesuai response JSON kamu: ambil dari res.data
        setEmployees(res.data);
      } catch (err) {
        toast.error("Gagal memuat data karyawan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("user.updated", (payload) => {
      toast.success(`Update: ${payload.data.name} mengubah profil`);

      setLogs((prev) => [
        {
          id: Date.now(),
          user: payload.data.name,
          action: "Update Profile",
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);

      // Update state tabel secara real-time jika ada perubahan
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === payload.data.id ? { ...emp, ...payload.data } : emp,
        ),
      );
    });

    return () => {
      socket.off("user.updated");
    };
  }, []);

  // Di dalam AdminDashboard.tsx
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER & SUMMARY */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Aplikasi Monitoring Karyawan
            </h1>
            <p className="text-gray-500 text-sm">
              Kelola data dan pantau aktivitas profil karyawan.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm">
            <UserPlus size={18} />
            <span>Tambah Karyawan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* TABEL MONITORING (Poin 37 & 38) */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-white">
              <h2 className="font-bold text-gray-800">Daftar Karyawan</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Karyawan</th>
                    <th className="px-6 py-4">Kontak</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Terakhir Update</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-20 text-gray-400 italic"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 border overflow-hidden">
                              {emp.photoUrl ? (
                                <img
                                  src={emp.photoUrl}
                                  alt={emp.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No Pic
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 capitalize">
                                {emp.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {emp.position || "Staff"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{emp.email}</p>
                          <p className="text-xs text-gray-400">
                            {emp.phone || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              emp.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(emp.updatedAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SIDEBAR LOGS (Poin 27) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell size={18} className="text-blue-500" />
                Live Activity
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {logs.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    Menunggu aktivitas...
                  </p>
                )}
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="relative pl-4 border-l-2 border-blue-100 py-1"
                  >
                    <p className="text-xs font-bold text-gray-800">
                      {log.user}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {log.action} • {log.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
