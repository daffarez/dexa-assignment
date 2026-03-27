import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth";
import { supabase } from "../lib/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let photoUrl = null;

      if (file) {
        photoUrl = await uploadImage();
      }

      await register({
        ...form,
        photoUrl,
      });

      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 bg-white rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Register</h2>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <input
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded-md"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-md"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          className="w-full p-2 border rounded-md"
          onChange={handleChange}
        />

        <input
          name="position"
          placeholder="Position"
          className="w-full p-2 border rounded-md"
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 text-white bg-black rounded-md hover:bg-gray-800"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Already have account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
