import React from "react";
import { useFormContext } from "react-hook-form";
import {
  ProductInputType,
  ProductUpdateType,
} from "@/features/products/product.types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useImageUploader } from "./use-image-uploader";

const ImagesPreview = ({
  previews,
  action,
}: {
  previews: string[];
  action:
    | {
        type: "new";
        handleRemoveFile: (
          index: number,
          onChange: (files: File[]) => void,
        ) => void;
        onChange: (files: File[]) => void;
      }
    | {
        type: "old";
        handleRemoveOldImage: (image: string) => void;
      };
}) => {
  return (
    <>
      {previews.map((url, i) => (
        <li key={i} className="relative shrink-0">
          <Image
            src={url}
            width={150}
            height={150}
            alt="preview"
            className="size-[150px] object-cover"
          />
          <button
            type="button"
            className="absolute top-1 right-1 z-10 cursor-pointer size-8 grid place-content-center text-sm bg-destructive text-destructive-foreground opacity-90 rounded-sm"
            onClick={() => {
              if (action.type === "new") {
                action.handleRemoveFile(i, action.onChange);
              } else {
                action.handleRemoveOldImage(url);
              }
            }}
          >
            x
          </button>
        </li>
      ))}
    </>
  );
};

interface VariantImageUploaderProps {
  index: number;
}

export const VariantImageUploader: React.FC<VariantImageUploaderProps> = ({
  index,
}) => {
  const { control } = useFormContext<ProductInputType>();
  const { previews, handleRemoveFile, handleAddFiles } = useImageUploader();
  return (
    <FormField
      control={control}
      name={`variants.${index}.images`}
      render={({ field: { ref, name, onBlur, onChange } }) => (
        <FormItem className="mt-4">
          <FormLabel>Ảnh</FormLabel>
          <ul className="flex gap-2 overflow-x-auto">
            <ImagesPreview
              previews={previews}
              action={{
                type: "new",
                handleRemoveFile,
                onChange,
              }}
            />
          </ul>
          <FormControl>
            <label className="inline-block w-max px-4 py-2 bg-secondary rounded-md cursor-pointer shadow-sm">
              Up ảnh
              <Input
                className="hidden"
                type="file"
                name={name}
                ref={ref}
                onBlur={onBlur}
                onChange={async (e) => {
                  if (!e.target.files) return;
                  handleAddFiles(Array.from(e.target.files), onChange);
                  e.target.value = "";
                }}
                multiple
              />
            </label>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface VariantMultiImageUploaderProps {
  index: number;
}
export const VariantMultiImageUploader: React.FC<
  VariantMultiImageUploaderProps
> = ({ index }) => {
  const { control, watch, setValue } = useFormContext<ProductUpdateType>();

  const { previews, handleAddFiles, handleRemoveFile } = useImageUploader();
  const oldImages = watch(`variants.${index}.oldImages`);
  const deletedImages = watch(`variants.${index}.deletedImages`);

  const handleRemoveOldImage = (image: string) => {
    setValue(
      `variants.${index}.oldImages`,
      oldImages.filter((url) => url !== image),
    );
    setValue(`variants.${index}.deletedImages`, [...deletedImages, image]);
  };

  return (
    <FormField
      control={control}
      name={`variants.${index}.images`}
      render={({ field: { ref, name, onBlur, onChange } }) => (
        <FormItem className="mt-4">
          <FormLabel>Ảnh</FormLabel>
          <ul className="flex gap-2 overflow-x-auto">
            <ImagesPreview
              previews={oldImages}
              action={{
                type: "old",
                handleRemoveOldImage,
              }}
            />
            <ImagesPreview
              previews={previews}
              action={{
                type: "new",
                handleRemoveFile,
                onChange,
              }}
            />
          </ul>
          <FormControl>
            <label className="inline-block w-max px-4 py-2 bg-secondary rounded-md cursor-pointer shadow-sm">
              Up ảnh
              <Input
                className="hidden"
                type="file"
                name={name}
                ref={ref}
                onBlur={onBlur}
                onChange={async (e) => {
                  if (!e.target.files) return;
                  handleAddFiles(Array.from(e.target.files), onChange);
                  e.target.value = "";
                }}
                multiple
              />
            </label>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
