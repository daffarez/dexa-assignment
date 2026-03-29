import {
  LogIn as LogInIcon,
  LogOut as LogOutIcon,
  Loader2,
} from "lucide-react";

interface AttendanceActionsProps {
  onAttendance: (type: "IN" | "OUT") => void;
  hasCheckedInToday: boolean;
  hasCheckedOutToday: boolean;
  loading: boolean;
}

export default function AttendanceActions({
  onAttendance,
  hasCheckedInToday,
  hasCheckedOutToday,
  loading,
}: AttendanceActionsProps) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50">
      <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-2 h-6 bg-blue-600 rounded-full"></div> Presensi Hari
        Ini
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tombol Check In */}
        <button
          onClick={() => onAttendance("IN")}
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

        <button
          onClick={() => onAttendance("OUT")}
          disabled={!hasCheckedInToday || hasCheckedOutToday || loading}
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
  );
}
