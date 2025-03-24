"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import {
  ArrayPath,
  FieldArray,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import {
  ProductInputType,
  ProductUpdateType,
} from "@/features/products/product.types";
import { Button } from "@/components/ui/button";
import FormTextInput from "@/components/shared/form/form-text-input";
import {
  Tabs,
  TabList,
  TabTrigger,
  TabPanel,
} from "@/components/custom-ui/tabs";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { compressImage } from "@/lib/utils";

export const VariantsForm = <T extends ProductUpdateType | ProductInputType>({
  name,
  defaultValue,
}: {
  name: ArrayPath<T>;
  defaultValue: FieldArray<T, ArrayPath<T>> | FieldArray<T, ArrayPath<T>>[];
}) => {
  const form = useFormContext<T>();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      <Tabs
        className="border border-input p-2 rounded-md shadow-sm"
        defaultValue="0"
      >
        <div className="flex items-center gap-2 mb-4">
          <TabList>
            {fields.map((field, index) => (
              <div key={field.id} className="relative flex items-center gap-2">
                <TabTrigger
                  value={index.toString()}
                  className="cursor-pointer py-2 px-6 rounded-md border border-secondary"
                  activeClassName="border-primary border"
                >
                  Variant {index + 1}
                </TabTrigger>
                <button
                  tabIndex={-1}
                  className="absolute top-1 right-1 size-4 grid place-content-center text-[8px] text-destructive cursor-pointer bg-secondary rounded-full"
                  onClick={() => remove(index)}
                >
                  X
                </button>
              </div>
            ))}
          </TabList>
          <Button
            type="button"
            tabIndex={-1}
            variant="outline"
            size="sm"
            className=""
            onClick={() => append(defaultValue)}
          >
            +
          </Button>
        </div>

        {fields.map((field, index) => (
          <TabPanel isHidden={true} value={index.toString()} key={field.id}>
            <VariantForm index={index} />
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
};

const VariantForm = ({ index }: { index: number }) => {
  const { getValues, control } = useFormContext<
    ProductInputType | ProductUpdateType
  >();
  const id: string | undefined = getValues("id");
  return (
    <div>
      <FormTextInput
        control={control}
        name={`variants.${index}.originPrice`}
        label="Giá gốc"
        placeholder="Nhập giá gốc"
      />
      <FormTextInput
        control={control}
        name={`variants.${index}.price`}
        label="Giá sản phẩm"
        placeholder="Nhập giá sản phẩm"
      />

      <FormTextInput
        control={control}
        name={`variants.${index}.countInStock`}
        label="Số lượng trong kho"
        placeholder="Nhập số lượng trong kho"
      />
      {/* <VariantImageUploader index={index} /> */}
      {id && id !== "" ? (
        <VariantMultiImageUploader index={index} />
      ) : (
        <VariantImageUploader index={index} />
      )}
      <VariantAttributeForm VariantIndex={index} />
    </div>
  );
};

const VariantAttributeForm = ({ VariantIndex }: { VariantIndex: number }) => {
  const form = useFormContext<ProductInputType | ProductUpdateType>();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${VariantIndex}.attributes`,
  });

  return (
    <div className="mt-4">
      <FormLabel>Thuộc tính</FormLabel>
      <ul className="max-h-80 overflow-y-auto">
        {fields.map((field, index) => (
          <li key={field.id} className="mt-2 flex items-start gap-2">
            <FormTextInput
              control={control}
              name={`variants.${VariantIndex}.attributes.${index}.name`}
              placeholder="Nhập tên thuộc tính"
            />

            <FormTextInput
              control={control}
              name={`variants.${VariantIndex}.attributes.${index}.value`}
              placeholder="Nhập giá trị"
            />

            <Button
              type="button"
              tabIndex={-1}
              variant="destructive"
              onClick={() => remove(index)}
            >
              X
            </Button>
          </li>
        ))}
      </ul>
      {/* Add New Attribute */}
      <Button
        type="button"
        variant="outline"
        className="w-max mt-2"
        onClick={() =>
          append({
            name: "",
            value: "",
          })
        }
      >
        + Thêm thuộc tính
      </Button>
    </div>
  );
};

interface VariantImageUploaderProps {
  index: number;
}

const VariantImageUploader: React.FC<VariantImageUploaderProps> = ({
  index,
}) => {
  const { control } = useFormContext<ProductInputType>();
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormField
      control={control}
      name={`variants.${index}.images`}
      render={({ field: { ref, name, onBlur, onChange } }) => (
        <FormItem className="mt-4">
          <FormLabel>Ảnh</FormLabel>
          <ul className="flex gap-2 overflow-x-auto">
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
                    URL.revokeObjectURL(previews[i]);
                    setPreviews((prev) => prev.filter((_, j) => j !== i));
                    setFiles((prev) => prev.filter((_, j) => j !== i));
                    onChange(files.filter((_, j) => j !== i));
                  }}
                >
                  x
                </button>
              </li>
            ))}
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

                  const newFiles = Array.from(e.target.files);
                  const compressedFiles = await Promise.all(
                    newFiles.map((file) => compressImage(file, 0.7, 800)),
                  );

                  const objectUrls = newFiles.map((file) =>
                    URL.createObjectURL(file),
                  );

                  setPreviews((prev) => [...prev, ...objectUrls]);
                  setFiles((prev) => [...prev, ...compressedFiles]);
                  onChange([...files, ...compressedFiles]);
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
const VariantMultiImageUploader: React.FC<VariantMultiImageUploaderProps> = ({
  index,
}) => {
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);
  const { control, watch, setValue } = useFormContext<ProductUpdateType>();

  const oldImages = watch(`variants.${index}.oldImages`);
  const deletedImages = watch(`variants.${index}.deletedImages`);
  React.useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <div className="flex gap-2 overflow-x-auto">
            {oldImages.map((url, i) => (
              <div key={i} className="relative">
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
                  onClick={() => handleRemoveOldImage(url)}
                >
                  x
                </button>
              </div>
            ))}

            {previews.map((url, i) => (
              <div key={i} className="relative">
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
                    URL.revokeObjectURL(previews[i]);
                    setPreviews((prev) => prev.filter((_, j) => j !== i));
                    setFiles((prev) => prev.filter((_, j) => j !== i));
                    onChange(files.filter((_, j) => j !== i));
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
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

                  const newFiles = Array.from(e.target.files);
                  const compressedFiles = await Promise.all(
                    newFiles.map((file) => compressImage(file, 0.7, 800)),
                  );

                  const objectUrls = newFiles.map((file) =>
                    URL.createObjectURL(file),
                  );

                  setPreviews((prev) => [...prev, ...objectUrls]);
                  setFiles((prev) => [...prev, ...compressedFiles]);
                  onChange([...files, ...compressedFiles]);
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
