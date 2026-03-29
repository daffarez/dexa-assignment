import { User, PencilLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
  user: {
    name: string;
    email: string;
    position: string;
    phone: string;
    photoUrl?: string;
    role: string;
  };
}
export default function ProfileCard({ user }: ProfileCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="mb-6 w-32 h-32 rounded-full border-[6px] border-gray-50 shadow-inner overflow-hidden bg-gray-100 flex items-center justify-center">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-300">
            <User size={48} />
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
      <p className="text-blue-600 font-bold text-xs mb-1 uppercase tracking-wider">
        {user.position}
      </p>
      <p className="text-gray-400 text-xs mb-4 font-medium">{user.email}</p>

      <div className="w-full pt-4 border-t border-gray-50 mb-6 text-center">
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
          Nomor Handphone
        </p>
        <p className="text-sm font-bold text-gray-700">{user.phone || "-"}</p>
      </div>

      <button
        onClick={() => navigate("/edit-profile")}
        className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-gray-100"
      >
        <PencilLine size={16} /> Edit Profil
      </button>
    </div>
  );
}
