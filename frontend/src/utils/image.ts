import { supabase } from "../lib/supabase";

export const uploadProfilePicture = async (
  file: File,
  oldPhotoUrl?: string,
): Promise<string> => {
  if (oldPhotoUrl) {
    const oldPath = oldPhotoUrl.split("/").pop();
    if (oldPath) {
      await supabase.storage.from("profile-pictures").remove([oldPath]);
    }
  }

  const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .upload(fileName, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-pictures").getPublicUrl(data.path);

  return publicUrl;
};

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
