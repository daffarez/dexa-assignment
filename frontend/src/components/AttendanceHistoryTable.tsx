export interface AttendanceRecord {
  date: string;
  masuk: string;
  pulang: string;
}

interface AttendanceHistoryTableProps {
  data: AttendanceRecord[];
}

export default function AttendanceHistoryTable({
  data,
}: AttendanceHistoryTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">
              Tanggal
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-center">
              Masuk
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-center">
              Pulang
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-10 text-center text-gray-400 italic text-sm"
              >
                Tidak ada data ditemukan.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <span className="text-sm font-black text-gray-700">
                    {item.date}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-1.5 rounded-lg text-sm font-black ${
                      item.masuk !== "-"
                        ? "bg-green-50 text-green-600"
                        : "text-gray-300"
                    }`}
                  >
                    {item.masuk}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-1.5 rounded-lg text-sm font-black ${
                      item.pulang !== "-"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-300"
                    }`}
                  >
                    {item.pulang}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
