import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { checkIn, checkOut, getMyAttendance } from "../services/attendance";
import { getProfileFromToken } from "../utils/auth";
import { useSearchParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import AttendanceActions from "../components/AttendanceActions";
import RecentActivities from "../components/RecentActivities";
import AttendanceFilter from "../components/AttendanceFilter";
import AttendanceHistoryTable, {
  type AttendanceRecord,
} from "../components/AttendanceHistoryTable";
import { useLoading } from "../context/LoadingContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const activeTab = searchParams.get("tab") || "PROFILE";
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = getProfileFromToken(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn("Token expired");
        localStorage.clear();
        navigate("/");
        return;
      }

      setUser(decoded);
      fetchAttendance();
    } catch (error) {
      console.error("Invalid token format");
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const res = await getMyAttendance();

      const dataFromServer = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setLogs(dataFromServer);
    } catch (err) {
      console.error("Failed fetchin attendance record", err);
      setLogs([]);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      if (type === "IN") await checkIn();
      else await checkOut();

      toast.success(`Berhasil Absen ${type === "IN" ? "Masuk" : "Pulang"}`);
      fetchAttendance();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal melakukan absen");
    } finally {
      setIsLoading(false);
    }
  };

  const getFirstDayOfMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-01`;
  };

  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startInput, setStartInput] = useState(getFirstDayOfMonth());
  const [endInput, setEndInput] = useState(getTodayDate());
  const [activeFilter, setActiveFilter] = useState({
    start: getFirstDayOfMonth(),
    end: getTodayDate(),
  });

  const handleSearch = () => {
    setActiveFilter({
      start: startInput,
      end: endInput,
    });
    fetchAttendance();
  };

  const filteredLogs = logs.filter((log) => {
    const d = new Date(log.date);
    const logDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    return logDateStr >= activeFilter.start && logDateStr <= activeFilter.end;
  });

  const groupedAttendance = filteredLogs.reduce((acc: any, curr: any) => {
    const d = new Date(curr.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, masuk: "-", pulang: "-" };
    }

    const timeStr = new Date(curr.time).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (curr.status === "MASUK") {
      acc[dateKey].masuk = timeStr;
    } else if (curr.status === "PULANG") {
      acc[dateKey].pulang = timeStr;
    }

    return acc;
  }, {});

  const displayData = Object.values(groupedAttendance).sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleStartDateChange = (val: string) => {
    setStartInput(val);
    if (val > endInput) {
      setEndInput(val);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndInput(val);
    if (val < startInput) {
      setStartInput(val);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
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
          {activeTab === "PROFILE" ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <ProfileCard user={user} />
              </div>
              <div className="xl:col-span-2 space-y-8">
                <AttendanceActions
                  onAttendance={handleAttendance}
                  hasCheckedInToday={hasCheckedInToday}
                  hasCheckedOutToday={hasCheckedOutToday}
                />
                <RecentActivities logs={logs} />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <AttendanceFilter
                startDate={startInput}
                endDate={endInput}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onSearch={handleSearch}
              />
              <AttendanceHistoryTable
                data={displayData as unknown[] as AttendanceRecord[]}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
