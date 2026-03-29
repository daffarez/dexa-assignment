import { supabase } from "../lib/supabase";

export const deleteImageFromSupabase = async (url: string) => {
  if (!url || url === "" || url.includes("data:image")) return;

  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    const { error } = await supabase.storage
      .from("profile-pictures")
      .remove([fileName]);

    if (error) {
      console.error("Gagal hapus file di Supabase:", error.message);
    }
  } catch (err) {
    console.error("Error parsing URL untuk hapus:", err);
  }
};
