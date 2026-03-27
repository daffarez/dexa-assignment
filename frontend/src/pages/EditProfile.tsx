import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/user";
import { supabase } from "../lib/supabase";
import {
  User,
  Camera,
  ArrowLeft,
  Save,
  Phone,
  Lock,
  UserCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    name: "",
    phone: "",
    position: "",
    password: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({ type: null, msg: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      position: user.position || "",
      password: "",
    });
    setPreview(user.photoUrl || "");
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: any) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadImage = async () => {
    if (!file) return null;
    const fileName = `avatar-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (error) throw error;
    const { data: publicUrl } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      let finalPhotoUrl = preview;
      if (file) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) finalPhotoUrl = uploadedUrl;
      }

      const payload: any = {
        phone: form.phone,
        photoUrl: finalPhotoUrl,
      };

      if (form.password) payload.password = form.password;

      const response = await updateProfile(payload);

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...response.data };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setStatus({ type: "success", msg: "Profil berhasil diperbarui!" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err?.response?.data?.message || "Gagal memperbarui profil",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Navigasi Atas */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-all font-semibold"
          >
            <ArrowLeft size={20} /> Kembali
          </button>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Pengaturan Akun
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="w-40 h-40 rounded-full border-8 border-gray-50 shadow-inner overflow-hidden bg-gray-100">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <User size={60} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full border-4 border-white shadow-lg cursor-pointer hover:bg-blue-700 transition-all">
                  <Camera size={20} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFile}
                    accept="image/*"
                  />
                </label>
              </div>

              <h3 className="text-xl font-bold text-gray-900">{form.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">
                {form.position}
              </p>

              <div className="w-full pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-widest justify-center">
                  <CheckCircle2 size={14} className="text-green-500" /> Profil
                  Terverifikasi
                </div>
              </div>
            </div>

            {status.msg && (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  status.type === "success"
                    ? "bg-green-50 border-green-100 text-green-700"
                    : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                <p className="text-sm font-bold">{status.msg}</p>
              </div>
            )}
          </div>

          {/* KOLOM KANAN: Form */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 space-y-8"
            >
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Informasi Karyawan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NAMA (READ ONLY) */}
                  <div className="space-y-2 opacity-70">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <UserCircle
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        value={form.name}
                        readOnly
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-xl font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* WHATSAPP (EDITABLE) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-blue-600">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                        size={18}
                      />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-blue-50/30 border-2 border-blue-100 focus:bg-white focus:border-blue-500 rounded-xl transition-all font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-6 border-t border-gray-50 pt-8">
                  Keamanan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PASSWORD (EDITABLE) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Ganti Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                        size={18}
                      />
                      <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Isi untuk mengganti"
                        className="w-full pl-12 pr-4 py-3.5 bg-blue-50/30 border-2 border-blue-100 focus:bg-white focus:border-blue-500 rounded-xl transition-all font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3.5 bg-black text-white rounded-xl font-bold flex items-center gap-3 hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
