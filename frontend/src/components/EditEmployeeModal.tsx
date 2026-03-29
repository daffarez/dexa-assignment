import {
  Briefcase,
  Camera,
  Phone,
  Trash2,
  UserCircle,
  UserIcon,
  Lock as LockIcon,
} from "lucide-react";
import React, { useRef } from "react";
import { FormInput } from "./FormInput";

interface EditFormData {
  name: string;
  email: string;
  role: string;
  position: string;
  phone: string;
  password: string;
  photoUrl: string;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.SubmitEvent) => void;
  formData: EditFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditFormData>>;
  editingId: string | null;
  setSelectedFile: (file: File | null) => void;
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingId,
  setSelectedFile,
}: EditEmployeeModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setFormData({ ...formData, photoUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-200 max-h-[95vh] overflow-y-auto mt-4">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-gray-900 italic">
            EDIT<span className="text-blue-600">KARYAWAN</span>
          </h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
            ID: {editingId?.split("-")[0]}... • {formData.email}
          </p>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-50 overflow-hidden flex items-center justify-center shadow-sm transition-all group-hover:border-blue-100">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon size={32} className="text-gray-300" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 flex gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 p-2 rounded-full text-white border-2 border-white hover:bg-blue-700 shadow-md"
              >
                <Camera size={14} />
              </button>
              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-red-50 p-2 rounded-full text-red-600 border-2 border-white hover:bg-red-100 shadow-md"
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <FormInput
            label="Nama Lengkap"
            icon={<UserCircle size={14} className="text-blue-500" />}
            value={formData.name}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-wider">
                Hak Akses
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <FormInput
              label="Password Baru"
              type="password"
              placeholder="Isi jika ganti"
              icon={<LockIcon size={14} className="text-red-500" />}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <FormInput
            label="Nomor Telepon"
            icon={<Phone size={14} className="text-blue-500" />}
            value={formData.phone}
            placeholder="0812..."
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <FormInput
            label="Posisi / Jabatan"
            icon={<Briefcase size={14} className="text-blue-500" />}
            value={formData.position}
            placeholder="Contoh: Backend Developer"
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
          />

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
