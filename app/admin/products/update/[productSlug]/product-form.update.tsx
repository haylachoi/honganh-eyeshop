"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { productUpdateSchema } from "@/features/products/product.validator";
import React, { useEffect, useState } from "react";
import {
  Control,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { updateProductAction } from "@/features/products/product.actions";
import {
  ProductType,
  ProductUpdateType,
} from "@/features/products/product.types";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/features/categories/category.types";
import { useAction } from "next-safe-action/hooks";
import { onActionError } from "@/lib/actions/action.helper";
import { TagType } from "@/features/tags/tag.type";
import { Label } from "@/components/ui/label";
import { compressImage } from "@/lib/utils";
import { toast } from "sonner";
import { ADMIN_ENDPOINTS, TOAST_MESSAGES } from "@/constants";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "use-debounce";
import slugify from "slugify";
import Image from "next/image";
import FormTextInput from "@/components/shared/form/form-text-input";
import FormTextArea from "@/components/shared/form/form-text-area";
import {
  Tabs,
  TabList,
  TabTrigger,
  TabPanel,
} from "@/components/custom-ui/tabs";
import { useRouter } from "next/navigation";

const ProductUpdateForm = ({
  categories,
  tags,
  product,
}: {
  categories: CategoryType[];
  tags: TagType[];
  product: ProductType;
}) => {
  const router = useRouter();
  const { execute, isPending } = useAction(updateProductAction, {
    onSuccess: () => {
      router.push(ADMIN_ENDPOINTS.PRODUCTS);
      toast.success(TOAST_MESSAGES.UPDATE.SUCCESS);
    },
    onError: onActionError,
  });

  const defaultValues: ProductUpdateType = {
    ...product,
    category: product.category.id,
    variants: product.variants.map((variant) => ({
      ...variant,
      images: [] as File[],
      deletedImages: [] as string[],
      oldImages: variant.images,
    })),
  };
  const form = useForm<ProductUpdateType>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues,
  });

  const [isManualSlug, setManualSlug] = useState(false);
  const { watch, setValue, control } = form;

  const selectedCategory = watch("category");
  const attributes = watch("attributes");
  const selectedTags = watch("tags");

  const nameValue = watch("name");

  const [debouncedName] = useDebounce(nameValue, 200);

  useEffect(() => {
    if (!isManualSlug) {
      setValue("slug", slugify(debouncedName, { lower: true, strict: true }));
    }
  }, [debouncedName, isManualSlug, setValue]);
  useEffect(() => {
    if (selectedCategory) {
      const attributes = categories.find(
        (category) => category.id === selectedCategory,
      )?.attributes;

      if (attributes) {
        setValue(
          "attributes",
          attributes.map((attribute) => ({
            name: attribute.name,
            value: "oho",
          })),
        );
      }
    }
  }, [selectedCategory, setValue, categories]);

  const onSubmit = async (data: ProductUpdateType) => {
    execute(data);
  };

  const handleTagsChange = ({ id, name }: { id: string; name: string }) => {
    if (selectedTags.find((tag) => tag.id === id)) {
      setValue(
        "tags",
        selectedTags.filter((tag) => tag.id !== id),
      );
    } else {
      setValue("tags", [...selectedTags, { id, name }]);
    }
  };

  return (
    <Form {...form}>
      {isPending && <div>Đang xử lý...</div>}
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          {tags.map((tag) => (
            <Label key={tag.id}>
              <Input
                type="checkbox"
                checked={selectedTags.some(
                  (selectedTag) => selectedTag.id === tag.id,
                )}
                onChange={() => handleTagsChange(tag)}
              />
              {tag.name}
            </Label>
          ))}
        </div>
        <VariantsForm />

        <FormTextInput
          control={control}
          name="name"
          label="Tên sản phẩm"
          placeholder="Nhập tên sản phẩm"
        />

        {/* Slug */}
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    isManualSlug
                      ? "Nhập slug (slug không chứa ký tự có dấu và khoảng trắng)"
                      : "Slug sẽ được tạo tự động từ tên"
                  }
                  {...field}
                  disabled={!isManualSlug}
                />
              </FormControl>
              <FormMessage />
              <Label>
                <Switch
                  checked={isManualSlug}
                  onCheckedChange={() => setManualSlug((prev) => !prev)}
                />
                Tạo thủ công
              </Label>
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Brand */}
        <FormTextInput
          control={control}
          name="brand"
          label="Thương hiệu"
          placeholder="Thương hiệu"
        />

        {/* Description */}
        <FormTextArea
          control={control}
          name="description"
          label="Mô tả"
          placeholder="Mô tả sản phẩm"
        />

        {/* isPublished */}
        <FormField
          control={control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Sản phẩm đã xuất bản?</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {attributes.map((attribute, index) => (
          <FormField
            key={attribute.name}
            control={control}
            name={`attributes.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{attribute.name}</FormLabel>
                <FormControl>
                  <Input placeholder={attribute.name} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Submit Button */}
        <Button type="submit" className="w-full cursor-pointer">
          submit
        </Button>
      </form>
    </Form>
  );
};

export default ProductUpdateForm;

const VariantsForm = () => {
  const form = useFormContext<ProductUpdateType>();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <>
      <Tabs defaultValue="0">
        <div className="flex items-center gap-2">
          <TabList>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <TabTrigger value={index.toString()}>
                  Variant {index + 1}
                </TabTrigger>
                <button className="p-2 text-sm" onClick={() => remove(index)}>
                  X
                </button>
              </div>
            ))}
          </TabList>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-max text-primary-foreground bg-primary"
            onClick={() =>
              append({
                attributes: [{ name: "", value: "" }],
                images: [],
                oldImages: [],
                deletedImages: [],
                originPrice: 0,
                price: 0,
                countInStock: 0,
              })
            }
          >
            +
          </Button>
        </div>

        {fields.map((field, index) => (
          <TabPanel isHidden={true} value={index.toString()} key={field.id}>
            <VariantForm index={index} control={control} />
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
};

interface VariantFormProps {
  index: number;
  control: Control<ProductUpdateType>;
}

const VariantForm: React.FC<VariantFormProps> = ({ index, control }) => {
  return (
    <div>
      <div className="flex gap-2">
        <FormField
          control={control}
          name={`variants.${index}.originPrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá gốc</FormLabel>
              <FormControl>
                <Input placeholder="Nhập giá gốc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`variants.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="Nhập giá" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`variants.${index}.countInStock`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng trong kho</FormLabel>
              <FormControl>
                <Input placeholder="Nhập số lượng trong kho" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <VariantImageUploader index={index} />
      <VariantAttributeForm VariantIndex={index} />
    </div>
  );
};

interface VariantImageUploaderProps {
  index: number;
  // control: Control<ProductInputType>;
}

const VariantImageUploader: React.FC<VariantImageUploaderProps> = ({
  index,
  // control,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { control, watch, setValue } = useFormContext<ProductUpdateType>();

  const oldImages = watch(`variants.${index}.oldImages`);
  const deletedImages = watch(`variants.${index}.deletedImages`);
  useEffect(() => {
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
        <FormItem>
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
                  className="absolute top-1 right-1 size-8 grid place-content-center text-sm bg-primary text-primary-foreground opacity-90 rounded-sm"
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
                  className="absolute top-1 right-1 size-8 grid place-content-center text-sm bg-primary text-primary-foreground opacity-90 rounded-sm"
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
            <Input
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
              }}
              multiple
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// const VariantsForm = () => {
//   const form = useFormContext<ProductInputType>();
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [files, setFiles] = useState<File[]>([]);
//   const { control } = form;
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `variants`,
//   });
//
//   useEffect(() => {
//     return () => {
//       previews.forEach((url) => URL.revokeObjectURL(url));
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   return (
//     <>
//       <Tabs defaultValue="0">
//         <div className="flex items-center gap-2">
//           <TabsList>
//             {fields.map((field, index) => (
//               <div key={field.id}>
//                 <TabsTrigger
//                   className="cursor-pointer"
//                   value={index.toString()}
//                 >
//                   Variant {index + 1}
//                 </TabsTrigger>
//                 <button
//                   className="p-2 cursor-pointer text-sm"
//                   onClick={() => remove(index)}
//                 >
//                   X
//                 </button>
//               </div>
//             ))}
//           </TabsList>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             className="w-max text-primary-foreground bg-primary"
//             onClick={() =>
//               append({
//                 attributes: [{ name: "", value: "" }],
//                 images: [],
//                 price: 0,
//                 countInStock: 0,
//               })
//             }
//           >
//             +
//           </Button>
//         </div>
//
//         {fields.map((field, index) => {
//           return (
//             <TabsContent value={index.toString()} key={field.id}>
//               <div className="flex gap-2">
//                 <FormField
//                   control={control}
//                   name={`variants.${index}.price`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Giá sản phẩm</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Nhập tiền" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={control}
//                   name={`variants.${index}.countInStock`}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Số lượng trong kho</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Nhập số lượng trong kho"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div>
//                 <FormField
//                   control={control}
//                   name={`variants.${index}.images`}
//                   render={({ field: { ref, name, onBlur, onChange } }) => (
//                     <FormItem>
//                       <FormLabel>Ảnh</FormLabel>
//                       <div className="flex gap-2 overflow-x-auto">
//                         {previews.map((url, index) => (
//                           <div key={index} className="relative">
//                             <Image
//                               src={url}
//                               width={150}
//                               height={150}
//                               alt="preview"
//                               className="size-[150px] object-cover"
//                             />
//                             <button
//                               type="button"
//                               className="absolute top-1 right-1 z-10 cursor-pointer size-8 grid place-content-center text-sm bg-primary text-primary-foreground opacity-90 rounded-sm"
//                               onClick={() => {
//                                 URL.revokeObjectURL(previews[index]);
//                                 const newPreviews = previews.filter(
//                                   (_, i) => i !== index,
//                                 );
//                                 const newFiles = files.filter(
//                                   (_, i) => i !== index,
//                                 );
//
//                                 setPreviews(newPreviews);
//                                 setFiles(newFiles);
//                                 onChange(newFiles);
//                               }}
//                             >
//                               x
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           name={name}
//                           ref={ref}
//                           onBlur={onBlur}
//                           onChange={async (e) => {
//                             if (!e.target.files) return;
//
//                             const files = Array.from(e.target.files);
//                             const compressedFiles = await Promise.all(
//                               files.map((file) =>
//                                 compressImage(file, 0.7, 800),
//                               ),
//                             );
//
//                             const objectUrls = files.map((file) =>
//                               URL.createObjectURL(file),
//                             );
//
//                             setPreviews((prev) => [...prev, ...objectUrls]);
//                             setFiles((prev) => [...prev, ...compressedFiles]);
//                             onChange(...files, ...compressedFiles);
//                           }}
//                           multiple
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <VariantAttributeForm VariantIndex={index} />
//             </TabsContent>
//           );
//         })}
//       </Tabs>
//     </>
//   );
// };

const VariantAttributeForm = ({ VariantIndex }: { VariantIndex: number }) => {
  const form = useFormContext<ProductInputType>();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${VariantIndex}.attributes`,
  });

  return (
    <div className="">
      <div className="max-h-80 overflow-y-auto">
        {fields.map((field, index) => (
          <div key={field.id} className="mt-2 flex items-end gap-2">
            <FormField
              control={control}
              name={`variants.${VariantIndex}.attributes.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thuộc tính</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên thuộc tính" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`variants.${VariantIndex}.attributes.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá thuộc tính</FormLabel>
                  <FormControl>
                    <Input placeholder="Giá trị" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              X
            </Button>
          </div>
        ))}
      </div>
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
