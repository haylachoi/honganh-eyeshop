"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { updateCustomerAvatarAction } from "@/features/users/user.actions";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { Camera, Check, X } from "lucide-react";
import { Id } from "@/types";

export default function AvatarUpload({
  defaultUrl,
  id,
}: {
  id: Id;
  defaultUrl?: string;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { execute, isPending } = useAction(updateCustomerAvatarAction, {
    onSuccess: (result) => {
      if (result.data) {
        setSelectedFile(null);
        toast.success("Ảnh đại diện đã được cập nhật thành công");
      }
    },
    onError: onActionError,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(defaultUrl || null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="relative size-32 rounded-full border border-foreground">
        <Image
          src={previewUrl || defaultUrl || "/avatar-placeholder.png"}
          alt="Avatar"
          fill
          className="object-cover inline-block size-32 rounded-full"
        />
        <div className="absolute bottom-2 right-2 z-10 bg-white/70 backdrop-blur-sm p-1 rounded-full cursor-pointer hover:bg-white transition">
          <label className="cursor-pointer">
            <Camera className="w-6 h-6 text-gray-700" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedFile && (
            <div className="flex gap-2 absolute top-0 right-0 translate-x-[80px]">
              <button
                type="button"
                onClick={() => execute({ id, avatar: selectedFile })}
                className="text-green-600 hover:text-green-700 transition cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <AnimateLoadingIcon />
                ) : (
                  <Check className="w-6 h-6" />
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
