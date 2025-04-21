import React from "react";
import { compressImage } from "@/lib/utils";

export const useImageUploader = () => {
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleAddFiles = async (
    newFiles: File[],
    onChange: (files: File[]) => void,
  ) => {
    const compressedFiles = await Promise.all(
      newFiles.map((file) => compressImage(file, 0.7, 800)),
    );
    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
    setFiles((prev) => [...prev, ...compressedFiles]);
    onChange([...files, ...compressedFiles]);
  };

  const handleRemoveFile = (
    index: number,
    onChange: (files: File[]) => void,
  ) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, j) => j !== index));
    setFiles((prev) => prev.filter((_, j) => j !== index));
    onChange(files.filter((_, j) => j !== index));
  };

  return {
    previews,
    files,
    setFiles,
    setPreviews,
    handleAddFiles,
    handleRemoveFile,
  };
};
