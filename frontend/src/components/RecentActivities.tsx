import {
  Calendar,
  LogIn as LogInIcon,
  LogOut as LogOutIcon,
} from "lucide-react";

interface Log {
  status: string;
  date: string;
  time: string;
}

interface RecentActivitiesProps {
  logs: Log[];
}

export default function RecentActivities({ logs }: RecentActivitiesProps) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <h3 className="text-lg font-black text-gray-900">Aktivitas Terkini</h3>
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
                      {new Date(log.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
  );
}
