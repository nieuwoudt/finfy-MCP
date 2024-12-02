"use client";

import { ChangeEvent, useState } from "react";
import { FileType } from "@/types";
import { compressImage } from "@/utils/helpers";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useUser } from "./useUser";

const useUploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const resetFiles = () => {
    setSelectedFiles(null);
  };

  const getCompressedFile = async (file: File) => {
    const isCheckExceededLimit = file.size > 4 * 1000 * 1000;

    const compressedFile =
      isCheckExceededLimit && file.type.includes("image")
        ? await compressImage(file)
        : file;
    return compressedFile;
  };

  const getFileData = async (compressedFile: File): Promise<FileType> => {
    const imageData: FileType = await new Promise<FileType>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = {
          url: reader.result as string,
          id: Date.now(),
          type: compressedFile.type,
          name: compressedFile.name,
        };
        resolve(data);
      };
      reader.readAsDataURL(compressedFile);
    });
    return imageData;
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {

      if (!user) throw new Error("User not authenticated");
      const filePath = `avatars/${user.id}/${file.name}`;
      const { error } = await supabase.storage
        .from("avatars") // Replace 'avatars' with your actual bucket name
        .upload(filePath, file, { upsert: true });
  
      if (error) {
        throw error;
      }
  
      const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

      const publicURL = data.publicUrl; // Correctly access publicUrl
  
      // Optionally update user profile with avatar URL
      const { error: updateError } = await supabase
        .from("users") // Replace with your user profile table
        .update({ avatar_url: publicURL })
        .eq("id", user.id);
  
      if (updateError) {
        throw updateError;
      }
  
      toast.success("Avatar uploaded successfully");
      return publicURL || null;
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar");
      return null;
    }
  };

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const compressedFile = await getCompressedFile(file);
        const fileData = await getFileData(compressedFile);
        const uploadedUrl = await uploadToSupabase(compressedFile);
        
        if (uploadedUrl) {
          setSelectedFiles({ ...fileData, url: uploadedUrl });
        } else {
          resetFiles(); 
        }
      } catch (error) {
        console.error("Error handling file change:", error);
        toast.error("Error uploading file");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    selectedFiles,
    isLoading,
    handleFilesChange,
    resetFiles,
    setSelectedFiles,
  };
};

export { useUploadFiles };
