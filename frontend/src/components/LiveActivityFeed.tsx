import { Bell } from "lucide-react";

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  time: string;
}

interface LiveActivityFeedProps {
  logs: ActivityLog[];
}

export default function LiveActivityFeed({ logs }: LiveActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Bell size={18} className="text-blue-500" />
        Live Activity
      </h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Menunggu aktivitas...</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="relative pl-4 border-l-2 border-blue-100 py-1"
            >
              <p className="text-xs font-bold text-gray-800">{log.user}</p>
              <p className="text-[10px] text-gray-500">
                {log.action} • {log.time}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
