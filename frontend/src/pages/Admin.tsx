import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { getUsers, updateUserByAdmin } from "../services/user";
import { toast, Toaster } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfileFromToken } from "../utils/auth";
import { getUserAttendance } from "../services/attendance";
import EmployeeTable from "../components/EmployeeTable";
import LiveActivityFeed from "../components/LiveActivityFeed";
import AttendanceHistoryModal from "../components/AttendanceHistoryModal";
import EditEmployeeModal from "../components/EditEmployeeModal";
import { supabase } from "../lib/supabase";
import { deleteImageFromSupabase } from "../utils/supabase";
import { useLoading } from "../context/LoadingContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const { setIsLoading } = useLoading();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeAttendance, setEmployeeAttendance] = useState<any[]>([]);
  const [isUserAttendanceModalOpen, setIsUserAttendanceModalOpen] =
    useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    phone: "",
    role: "EMPLOYEE",
    password: "",
    photoUrl: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenEditModal = (emp: any) => {
    setEditingId(emp.id);
    setFormData({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      phone: emp.phone || "",
      role: emp.role,
      password: "",
      photoUrl: emp.photoUrl,
    });
    setIsUserEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const originalUser = employees.find((emp) => emp.id === editingId);
      const initialPhotoUrl = originalUser?.photoUrl || "";

      let finalPhotoUrl = formData.photoUrl;

      if (selectedFile) {
        if (initialPhotoUrl) {
          await deleteImageFromSupabase(initialPhotoUrl);
        }

        const fileName = `avatar-${Date.now()}`;
        const { data, error } = await supabase.storage
          .from("profile-pictures")
          .upload(fileName, selectedFile);

        if (error) throw error;
        const { data: publicUrl } = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(data.path);
        finalPhotoUrl = publicUrl.publicUrl;
      } else if (formData.photoUrl === "" && initialPhotoUrl !== "") {
        await deleteImageFromSupabase(initialPhotoUrl);
        finalPhotoUrl = "";
      }

      if (editingId) {
        const payload = {
          ...formData,
          photoUrl: finalPhotoUrl,
        };

        await updateUserByAdmin(editingId, payload);
      }

      toast.success("Update Berhasil!");
      fetchData();
      setIsUserEditModalOpen(false);
    } catch (err: any) {
      const errorMsg = Array.isArray(err?.response?.data?.message)
        ? err?.response?.data?.message[0]
        : err?.response?.data?.message;

      toast.error(errorMsg || "Gagal memperbarui data karyawan");
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getUsers();
      setEmployees(res.data);
    } catch (err) {
      toast.error("Gagal memuat data karyawan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
          <div className="lg:col-span-3">
            <EmployeeTable
              employees={employees}
              onShowAttendance={handleShowAttendance}
              onEditEmployee={handleOpenEditModal}
            />
          </div>

          <div className="lg:col-span-1">
            <LiveActivityFeed logs={logs} />
          </div>
        </div>
      </div>
      <AttendanceHistoryModal
        isOpen={isUserAttendanceModalOpen}
        onClose={() => setIsUserAttendanceModalOpen(false)}
        employee={selectedEmployee}
        attendanceData={employeeAttendance}
      />
      <EditEmployeeModal
        isOpen={isUserEditModalOpen}
        onClose={() => setIsUserEditModalOpen(false)}
        onSubmit={handleUpdateUser}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
}
