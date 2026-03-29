import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  UserPlus,
  Phone,
  Mail,
  Lock,
  UserCircle,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { getProfileFromToken } from "../utils/auth";
import { AvatarUpload } from "../components/AvatarUpload";
import { FormInput } from "../components/FormInput";
import { FormSelect } from "../components/FormSelect";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    password: "",
    role: "EMPLOYEE",
  });

  // Role Protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const user = getProfileFromToken(token);
      if (user.role !== "ADMIN") navigate("/admin");
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleRemovePhoto = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = "";
      if (file) {
        const fileName = `avatar-${Date.now()}`;
        const { data, error } = await supabase.storage
          .from("profile-pictures")
          .upload(fileName, file);
        if (error) throw error;
        photoUrl = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(data.path).data.publicUrl;
      }

      await register({ ...form, photoUrl });
      toast.success(`Karyawan ${form.name} berhasil didaftarkan!`);
      navigate("/admin");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Tetap Sama */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200/70">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white text-gray-400 rounded-2xl shadow-sm border border-gray-100 hover:text-blue-600"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-3xl font-black italic">
              FORM<span className="text-blue-600">PENDAFTARAN</span>
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-10"
        >
          <div className="lg:w-1/3">
            <AvatarUpload
              preview={preview}
              onFileChange={handleFileChange}
              onRemove={handleRemovePhoto}
            />
          </div>

          <div className="lg:flex-1 bg-white rounded-[2.5rem] p-12 border border-gray-100/50 space-y-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">
              Detail Informasi Karyawan
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <FormInput
                label="Nama Lengkap"
                icon={<UserCircle size={12} />}
                name="name"
                required
                placeholder="Nama Sesuai KTP"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <FormInput
                label="Email Kantor"
                icon={<Mail size={12} />}
                name="email"
                type="email"
                required
                placeholder="contoh@perusahaan.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FormInput
                label="Nomor Telepon"
                icon={<Phone size={12} />}
                name="phone"
                placeholder="0812..."
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />{" "}
              {/* Opsional: tambahkan phone ke state form jika perlu */}
              <FormInput
                label="Posisi"
                icon={<UserPlus size={12} />}
                name="position"
                placeholder="Staff"
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <FormSelect
                label="Hak Akses"
                icon={<ShieldCheck size={12} className="text-blue-500" />}
                options={[
                  { value: "EMPLOYEE", label: "EMPLOYEE" },
                  { value: "ADMIN", label: "ADMIN" },
                ]}
                value={form.role}
                onChange={(val) => setForm({ ...form, role: val })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-end pt-6 border-t border-gray-100">
              <FormInput
                label="Password Sementara"
                icon={<Lock size={12} className="text-red-500" />}
                name="password"
                type="password"
                required
                placeholder="Min 8 karakter"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={16} /> Daftarkan Karyawan
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
