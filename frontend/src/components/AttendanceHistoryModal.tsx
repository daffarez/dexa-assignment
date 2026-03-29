import { User as UserIcon, X } from "lucide-react";

interface AttendanceRecord {
  date: string;
  masuk: string;
  pulang: string;
}

interface Employee {
  name: string;
  photoUrl?: string;
}

interface AttendanceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  attendanceData: AttendanceRecord[];
}

export default function AttendanceHistoryModal({
  isOpen,
  onClose,
  employee,
  attendanceData,
}: AttendanceHistoryModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              {employee.photoUrl ? (
                <img
                  src={employee.photoUrl}
                  className="w-full h-full object-cover"
                  alt={employee.name}
                />
              ) : (
                <div className="text-gray-400">
                  <UserIcon size={20} strokeWidth={2.5} />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">
                {employee.name}
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Riwayat Presensi (Read-Only)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>
        
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
              {attendanceData.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-8 py-10 text-center text-gray-400 italic"
                  >
                    Belum ada riwayat absen.
                  </td>
                </tr>
              ) : (
                attendanceData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
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
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
