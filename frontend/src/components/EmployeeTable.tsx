import { UserIcon } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  photoUrl?: string;
  updatedAt: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onShowAttendance: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  onShowAttendance,
  onEditEmployee,
}: EmployeeTableProps) {
  const sortedEmployees = [...employees].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
            {sortedEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                      {emp.photoUrl ? (
                        <img
                          src={emp.photoUrl}
                          alt={emp.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-300">
                          <UserIcon size={20} strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {emp.name}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700">{emp.email}</p>
                  <p className="text-xs text-gray-400">{emp.phone || "-"}</p>
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
                      onClick={() => onShowAttendance(emp)}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-100 transition-all"
                    >
                      Presensi
                    </button>
                    <button
                      onClick={() => onEditEmployee(emp)}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-gray-200 transition-all"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
