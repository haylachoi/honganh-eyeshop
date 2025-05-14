import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export const UploadIcon = <T extends FieldValues>({
  name,
  control,
  defaultValue,
}: {
  name: Path<T>;
  control: Control<T>;
  defaultValue: string;
}) => {
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
              Upload Logo
            </FormLabel>
            <FormControl>
              <Input
                className="hidden"
                type="file"
                accept=".svg"
                {...rest}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const objectUrl = URL.createObjectURL(file);
                  setLogoPreviewUrl(objectUrl);

                  file.text().then((text) => {
                    onChange(text);
                  });
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
