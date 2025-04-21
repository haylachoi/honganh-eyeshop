"use client";

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
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { updateProductAction } from "@/features/products/product.actions";
import {
  ProductType,
  ProductUpdateType,
} from "@/features/products/product.types";
import { CategoryType } from "@/features/categories/category.types";
import { useAction } from "next-safe-action/hooks";
import { onActionError } from "@/lib/actions/action.helper";
import { TagType } from "@/features/tags/tag.type";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ADMIN_ENDPOINTS, TOAST_MESSAGES } from "@/constants";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "use-debounce";
import FormTextInput from "@/components/shared/form/form-text-input";
import FormTextArea from "@/components/shared/form/form-text-area";
import { useRouter } from "next/navigation";
import FormSelectInput from "@/components/shared/form/form-select-input";
import FormCheckbox from "@/components/shared/form/form-check-box";
import SubmitButton from "@/components/custom-ui/submit-button";
import { AttributesForm } from "../../_components/form/attributes-form";
import { TagsForm } from "../../_components/form/tags-form";
import { VariantsForm } from "../../_components/form/variants-form";
import { slugifyVn } from "@/lib/utils";

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

  const nameValue = watch("name");

  const isPublished = watch("isPublished");
  const firstVariant = watch("variants.0");

  const [debouncedName] = useDebounce(nameValue, 200);

  useEffect(() => {
    if (!isPublished) {
      setValue("isAvailable", false);
    }
  }, [isPublished, setValue]);

  useEffect(() => {
    if (!isManualSlug) {
      setValue("slug", slugifyVn(debouncedName));
    }
  }, [debouncedName, isManualSlug, setValue]);

  useEffect(
    () => {
      if (selectedCategory) {
        const attributes = categories.find(
          (category) => category.id === selectedCategory,
        )?.attributes;

        if (!attributes) return;

        if (selectedCategory !== defaultValues.category) {
          setValue(
            "attributes",
            attributes.map((attribute) => ({
              name: attribute.name,
              displayName: attribute.display,
              value: attribute?.defaultValue || "",
              valueSlug: slugifyVn(attribute.defaultValue || ""),
            })),
          );
        } else {
          const temp = attributes
            .filter(
              (att) =>
                !defaultValues.attributes.some(
                  (defaultAtt) => defaultAtt.name === att.name,
                ),
            )
            .map((att) => ({
              name: att.name,
              displayName: att.display,
              value: att?.defaultValue || "",
              valueSlug: slugifyVn(att?.defaultValue || ""),
            }));

          const mergedAtts = [...defaultValues.attributes, ...temp];
          setValue("attributes", mergedAtts);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedCategory,
      // setValue,
      categories,
      defaultValues.category,
      defaultValues.attributes,
    ],
  );
  const onSubmit = async (data: ProductUpdateType) => {
    // const updatedFields = getDirtyValues(dirtyFields, data);
    // data.attributes = data.attributes.map((attribute) => ({
    //   ...attribute,
    //   name: slugifyVn(attribute.displayName),
    // }));
    execute(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
        <FormSelectInput
          control={control}
          label="Danh mục"
          name="category"
          placeholder="Chọn danh mục"
          list={categories}
          listIdKey="id"
          listValueKey="name"
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

        <AttributesForm />

        <TagsForm tags={tags} />

        <VariantsForm<ProductUpdateType>
          name="variants"
          defaultValue={{
            attributes:
              firstVariant?.attributes?.map((att) => ({
                name: att.name,
                value: "",
              })) || [],
            images: [],
            originPrice: firstVariant?.originPrice || 0,
            price: firstVariant?.price || 0,
            countInStock: firstVariant?.countInStock || 0,
            uniqueId: crypto.randomUUID(),
            deletedImages: [],
            oldImages: [],
          }}
        />

        <FormCheckbox control={control} name="isPublished" label="Công khai" />
        <FormCheckbox
          control={control}
          name="isAvailable"
          label="Được bán"
          disabled={!isPublished}
        />

        {/* Submit Button */}
        <SubmitButton
          label="Cập nhật"
          isLoading={isPending}
          disabled={isPending}
        />
      </form>
    </Form>
  );
};

export default ProductUpdateForm;
