import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Camera, UserPlus, Phone, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { getProfileFromToken } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Sesi habis, silakan login kembali");
      navigate("/");
      return;
    }

    try {
      const user = getProfileFromToken(token);

      if (user.role !== "ADMIN") {
        toast.error("Akses ditolak. Fitur ini khusus untuk Admin.");
        navigate("/admin");
      }
    } catch (err) {
      navigate("/");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    password: "",
    role: "EMPLOYEE",
    photoUrl: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl;

      if (file) {
        const uploadedUrl = await uploadImage();
        photoUrl = uploadedUrl ?? "";
      }

      await register({ ...form, photoUrl });

      toast.success(`Karyawan ${form.name} berhasil didaftarkan!`, {
        style: { borderRadius: "1rem", fontWeight: "bold" },
      });
      navigate("/admin");
    } catch (err: any) {
      const errorMsg = Array.isArray(err?.response?.data?.message)
        ? err?.response?.data?.message[0]
        : err?.response?.data?.message;

      toast.error(errorMsg || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 md:p-12 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200/70">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm border border-gray-100"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight italic">
                FORM<span className="text-blue-600">PENDAFTARAN</span>
              </h1>
              <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <UserPlus size={14} className="text-blue-500" />
                Daftarkan Karyawan Baru ke Database
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-blue-600 hover:underline"
          >
            Kembali ke Dashboard
          </button>
        </div>

        {/* Main Content: Wider Layout */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-10"
        >
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm p-10 border border-gray-100/50">
              <div className="text-center space-y-6">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200/70 flex items-center justify-center overflow-hidden group-hover:border-blue-300 transition-all">
                    {preview ? (
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                        alt="Preview Avatar"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Camera
                          className="text-gray-300 mx-auto mb-2"
                          size={28}
                        />
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
                    onChange={handleFileChange}
                    id="avatarInput"
                  />
                  <label
                    htmlFor="avatarInput"
                    className="absolute -bottom-3 -right-3 bg-blue-600 text-white shadow-xl p-3 rounded-2xl border-4 border-white cursor-pointer hover:bg-blue-700 transition-all"
                  >
                    <Camera size={18} />
                  </label>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-bold bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  Pastikan semua data diisi dengan benar sebelum menekan tombol
                  pendaftaran. Foto profil bersifat opsional, namun
                  direkomendasikan.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:flex-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm p-12 border border-gray-100/50">
              <h2 className="text-xl font-bold text-gray-800 mb-10 pb-4 border-b border-gray-100">
                Detail Informasi Karyawan
              </h2>

              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider flex items-center gap-2">
                      <UserPlus size={12} className="text-blue-500" />
                      Nama Lengkap (Sesuai KTP)
                    </label>
                    <input
                      name="name"
                      required
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider flex items-center gap-2">
                      <Mail size={12} className="text-blue-500" />
                      Email Kantor (Unique)
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
                      placeholder="contoh@perusahaan.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider flex items-center gap-2">
                      <Phone size={12} className="text-blue-500" />
                      Nomor Telepon
                    </label>
                    <input
                      name="phone"
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
                      placeholder="Contoh: 0812XXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider flex items-center gap-2">
                      <Phone size={12} className="text-blue-500" />
                      Posisi
                    </label>
                    <input
                      name="position"
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
                      placeholder="Staff"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none"
                  >
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-end pt-6 border-t border-gray-100 mt-10">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider flex items-center gap-2">
                      <Lock size={12} className="text-red-500" />
                      Password Sementara (Berikan ke Karyawan)
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mendaftarkan Karyawan...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Daftarkan Karyawan Baru
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center text-[11px] font-black text-gray-400 uppercase tracking-widest pt-10 pb-6">
          © {new Date().getFullYear()} Monitoring Karyawan App • Sistem
          Registrasi Terpusat
        </div>
      </div>
    </div>
  );
}
