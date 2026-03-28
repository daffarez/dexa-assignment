import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { getUsers, updateUserByAdmin } from "../services/user";
import { toast, Toaster } from "react-hot-toast";
import { Bell, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfileFromToken } from "../utils/auth";
import { getUserAttendance } from "../services/attendance";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeAttendance, setEmployeeAttendance] = useState<any[]>([]);
  const [isUserAttendanceModalOpen, setIsUserAttendanceModalOpen] =
    useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "EMPLOYEE",
    password: "", // Opsional untuk edit, wajib untuk tambah
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenEditModal = (emp: any) => {
    setEditingId(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone || "",
      role: emp.role,
      password: "",
    });
    setIsUserEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await updateUserByAdmin(editingId, payload);

      toast.success("Data karyawan berhasil diperbarui!");
      setIsUserEditModalOpen(false);

      const res = await getUsers();
      setEmployees(res.data);

      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal update data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsers();
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
    socket.on("user_activity", (payload) => {
      toast.success(`Update: ${payload.data.name} mengubah profil`, {
        duration: 4000,
      });

      setLogs((prev) =>
        [
          {
            id: Date.now(),
            user: payload.data.name,
            action: "Update Profile",
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...prev,
        ].slice(0, 10),
      );

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === payload.data.id
            ? { ...emp, ...payload.data, updatedAt: new Date() }
            : emp,
        ),
      );
    });

    return () => {
      socket.off("user_activity");
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const decoded: any = getProfileFromToken(token);
    if (decoded.role !== "ADMIN") {
      navigate("/dashboard");
    }
  }, []);

  const handleShowAttendance = async (emp: any) => {
    setSelectedEmployee(emp);
    setIsUserAttendanceModalOpen(true);

    try {
      const res = await getUserAttendance(emp.id);

      const rawLogs = res.data.data;
      const grouped = formatGroupedData(rawLogs);

      setEmployeeAttendance(grouped);
    } catch (err) {
      toast.error("Gagal mengambil riwayat absensi");
    }
  };

  const formatGroupedData = (logs: any[]) => {
    const grouped = logs.reduce((acc: any, curr: any) => {
      const d = new Date(curr.date);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, masuk: "-", pulang: "-" };
      }

      const timeStr = new Date(curr.time).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (curr.status === "MASUK") acc[dateKey].masuk = timeStr;
      if (curr.status === "PULANG") acc[dateKey].pulang = timeStr;

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  };

  const handleAddEmployeeButton = () => {
    navigate("/register", { state: { fromAdmin: true } });
  };

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
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm"
            onClick={() => handleAddEmployeeButton()}
          >
            <UserPlus size={18} />
            <span>Tambah Karyawan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleShowAttendance(emp)}
                              className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-100 transition-all"
                            >
                              <span>Presensi</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(emp)}
                              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-gray-200 transition-all"
                            >
                              <span>Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
      {isUserAttendanceModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.photoUrl}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  alt=""
                />
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    Riwayat Presensi (Read-Only)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUserAttendanceModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Table */}
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Tanggal</th>
                    <th className="px-8 py-4 text-center">Masuk</th>
                    <th className="px-8 py-4 text-center">Pulang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* Gunakan logic Grouping yang kita buat sebelumnya agar satu baris per hari */}
                  {employeeAttendance.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-8 py-10 text-center text-gray-400 italic"
                      >
                        Belum ada riwayat absen.
                      </td>
                    </tr>
                  ) : (
                    // Map data groupedAttendance di sini
                    employeeAttendance.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-8 py-4 text-sm font-bold text-gray-700">
                          {item.date}
                        </td>
                        <td className="px-8 py-4 text-center text-sm font-black text-green-600">
                          {item.masuk}
                        </td>
                        <td className="px-8 py-4 text-center text-sm font-black text-blue-600">
                          {item.pulang}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50 text-right">
              <button
                onClick={() => setIsUserAttendanceModalOpen(false)}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {isUserEditModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-200">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-gray-900 italic">
                EDIT<span className="text-blue-600">KARYAWAN</span>
              </h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                ID: {editingId?.split("-")[0]}... • {formData.email}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleUpdateUser}>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">
                    Hak Akses
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer appearance-none"
                  >
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Isi jika ganti"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUserEditModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
