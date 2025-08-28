import { supabase } from "./supabaseClient"

export const uploadFile = async (filePath: string, file: File, bucket: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw new Error(error.message);
  return data.path
}


export const getPublicUrl = async (filePath: string, bucket = "Images") => {
  const { data } = await supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl;
}