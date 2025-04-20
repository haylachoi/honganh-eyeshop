"use client";

import slugify from "slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryInputType } from "@/features/categories/category.types";
import { CategoryInputSchema } from "@/features/categories/category.validator";
import { createCategoryAction } from "@/features/categories/category.actions";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { onActionError } from "@/lib/actions/action.helper";

const defaultValues: CategoryInputType = {
  name: "",
  slug: "",
  description: "",
  attributes: [{ name: "", display: "" }],
};
const CategoryCreateForm = () => {
  const form = useForm<CategoryInputType>({
    resolver: zodResolver(CategoryInputSchema),
    defaultValues,
  });
  const { execute, isPending } = useAction(createCategoryAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CREATE.SUCCESS);
    },
    onError: onActionError,
  });
  const { watch, setValue, control } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "attributes",
  });
  const [isManualSlug, setManualSlug] = useState(false);

  const onSubmit = async (data: CategoryInputType) => {
    execute(data);
  };

  const nameValue = watch("name");

  const [debouncedName] = useDebounce(nameValue, 200);

  // if (!manualSlug) {
  //   setValue("slug", slugify(debouncedName, { lower: true, strict: true }));
  // }

  useEffect(() => {
    if (!isManualSlug) {
      setValue("slug", slugify(debouncedName, { lower: true, strict: true }));
    }
  }, [debouncedName, isManualSlug, setValue]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        // action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên loại sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên loại sản phẩm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả loai sản phẩm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Attribute Fields */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Thuộc tính sản phẩm</h3>
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center">
              {/* Key Field */}
              <FormField
                control={control}
                name={`attributes.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Tên thuộc tính" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value Field */}
              <FormField
                control={control}
                name={`attributes.${index}.display`}
                render={({ field }) => (
                  <FormItem className="grow-1">
                    <FormControl>
                      <Input placeholder="Tên hiển thị" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`attributes.${index}.defaultValue`}
                render={({ field }) => (
                  <FormItem className="grow-1">
                    <FormControl>
                      <Input placeholder="Giá trị mặc định" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                X
              </Button>
            </div>
          ))}

          {/* Add New Attribute */}
          <Button
            type="button"
            variant="outline"
            className="w-max"
            onClick={() => append({ name: "", display: "" })}
          >
            + Thêm thuộc tính
          </Button>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          Tạo
        </Button>
      </form>
    </Form>
  );
};

export default CategoryCreateForm;
