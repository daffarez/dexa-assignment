interface AttendanceFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
}

export default function AttendanceFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: AttendanceFilterProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-gray-400 uppercase">
          Filter Tanggal (From - To)
        </label>
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-transparent text-sm font-bold outline-none px-2 focus:text-blue-600"
          />
          <span className="text-gray-300 font-bold">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-transparent text-sm font-bold outline-none px-2 focus:text-blue-600"
          />
          <button
            onClick={onSearch}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            Cari
          </button>
        </div>
      </div>
    </div>
  );
}
