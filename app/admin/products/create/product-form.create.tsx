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
import { ProductInputSchema } from "@/features/products/product.validator";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { createProductAction } from "@/features/products/product.actions";
import { ProductInputType } from "@/features/products/product.types";
import { CategoryType } from "@/features/categories/category.types";
import { useAction } from "next-safe-action/hooks";
import { onActionError } from "@/lib/actions/action.helper";
import { TagType } from "@/features/tags/tag.type";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "use-debounce";
import FormTextInput from "@/components/shared/form/form-text-input";
import FormTextArea from "@/components/shared/form/form-text-area";
import FormSelectInput from "@/components/shared/form/form-select-input";
import FormCheckbox from "@/components/shared/form/form-check-box";
import SubmitButton from "@/components/custom-ui/submit-button";
import { VariantsForm } from "../_components/form/variants-form";
import { useForm } from "react-hook-form";
import { TagsForm } from "../_components/form/tags-form";
import { AttributesForm } from "../_components/form/attributes-form";
import { slugifyVn } from "@/lib/utils";

const defaultValues: ProductInputType = {
  name: "ten",
  slug: "slug",
  category: "",
  attributes: [],
  brand: "brand",
  description: "hhihi",
  isPublished: true,
  tags: [],
  variants: [
    {
      images: [],
      uniqueId: crypto.randomUUID(),
      attributes: [{ name: "color", value: "den" }],
      originPrice: 1000,
      price: 1000,
      countInStock: 100,
    },
  ],
};

const ProductCreateForm = ({
  categories,
  tags,
}: {
  categories: CategoryType[];
  tags: TagType[];
}) => {
  defaultValues.category = categories[0].id;

  const { execute, isPending } = useAction(createProductAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CREATE.SUCCESS);
    },
    onError: onActionError,
  });
  const form = useForm<ProductInputType>({
    resolver: zodResolver(ProductInputSchema),
    defaultValues,
  });

  const [isManualSlug, setManualSlug] = useState(false);
  const { watch, setValue, control } = form;

  const selectedCategory = watch("category");

  const nameValue = watch("name");

  const [debouncedName] = useDebounce(nameValue, 200);

  useEffect(() => {
    if (!isManualSlug) {
      setValue("slug", slugifyVn(debouncedName));
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
            value: "",
            valueSlug: "",
          })),
        );
      }
    }
  }, [selectedCategory, setValue, categories]);

  const onSubmit = async (data: ProductInputType) => {
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

        <VariantsForm<ProductInputType>
          name="variants"
          defaultValue={{
            attributes: [],
            images: [],
            originPrice: 0,
            price: 0,
            countInStock: 0,
            uniqueId: crypto.randomUUID(),
          }}
        />

        <FormCheckbox control={control} name="isPublished" label="Sẽ bán" />

        {/* Submit Button */}
        <SubmitButton label="Tạo" isLoading={isPending} disabled={isPending} />
      </form>
    </Form>
  );
};

export default ProductCreateForm;
