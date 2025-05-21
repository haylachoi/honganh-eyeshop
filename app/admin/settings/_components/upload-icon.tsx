import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { compressImage } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type UploadFileIconProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  defaultValue: string;
  toWebp?: {
    quality: number;
    maxWidth: number;
  };
} & React.InputHTMLAttributes<HTMLInputElement>;

export const UploadFileIcon = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  toWebp,
  ...inputProps
}: UploadFileIconProps<T>) => {
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(
    typeof defaultValue === "string" ? defaultValue : null,
  );

  useEffect(() => {
    return () => {
      if (logoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  return (
    <div className="flex flex-row-reverse justify-end gap-4 border border-input rounded-md p-4 h-[80px]">
      {logoPreviewUrl && (
        <Image
          src={logoPreviewUrl}
          alt="Logo preview"
          width={64}
          height={64}
          className="object-contain"
        />
      )}

      <FormField
        control={control}
        name={name}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel className="font-normal cursor-pointer">
              <UploadCloudIcon />
              Upload File
            </FormLabel>
            <FormControl>
              <Input
                className="hidden"
                type="file"
                {...rest}
                {...inputProps}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  let newFile = file;
                  if (toWebp) {
                    newFile = await compressImage(
                      file,
                      toWebp.quality,
                      toWebp.maxWidth,
                    );
                  }
                  const objectUrl = URL.createObjectURL(newFile);
                  setLogoPreviewUrl(objectUrl);

                  onChange(newFile);
                  e.target.value = "";
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
