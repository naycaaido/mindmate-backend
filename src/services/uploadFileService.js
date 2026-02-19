import supabase from "../utils/supabaseClient.js";

export const uploadUserAsset = async (file, filePath) => {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Dapatkan URL publik
  const { data: publicUrl } = supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  return { path: filePath, url: publicUrl.publicUrl };
};

export default uploadUserAsset;
