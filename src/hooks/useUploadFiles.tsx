"use client";

import { ChangeEvent, useState } from "react";
import { FileType } from "@/types";
import { compressImage } from "@/utils/helpers";

const useUploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setIsLoading(true);
      const compressedFile = await getCompressedFile(file);
      const fileData = await getFileData(compressedFile);
      setSelectedFiles(fileData);
      setIsLoading(false);
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
