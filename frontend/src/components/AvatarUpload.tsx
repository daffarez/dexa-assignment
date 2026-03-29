import { Camera, Trash2 } from "lucide-react";

interface AvatarUploadProps {
  preview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const AvatarUpload = ({
  preview,
  onFileChange,
  onRemove,
}: AvatarUploadProps) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm p-10 border border-gray-100/50">
    <div className="text-center space-y-6">
      <div className="relative inline-block group">
        <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200/70 flex items-center justify-center overflow-hidden group-hover:border-blue-300 transition-all">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : (
            <div className="text-center p-4">
              <Camera className="text-gray-300 mx-auto mb-2" size={28} />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Pilih Foto
              </span>
            </div>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
          id="avatarInput"
        />

        <div className="absolute -bottom-3 -right-3 flex flex-col gap-2">
          <label
            htmlFor="avatarInput"
            className="bg-blue-600 text-white shadow-xl p-3 rounded-2xl border-4 border-white cursor-pointer hover:bg-blue-700 transition-all"
          >
            <Camera size={18} />
          </label>
          {preview && (
            <button
              type="button"
              onClick={onRemove}
              className="bg-red-500 text-white shadow-xl p-3 rounded-2xl border-4 border-white hover:bg-red-600 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 font-bold bg-gray-50 p-5 rounded-2xl border border-gray-100">
        Foto profil bersifat opsional, namun direkomendasikan.
      </p>
    </div>
  </div>
);
