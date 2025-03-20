"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useTipTapEditor from "@/hooks/use-editor";
import TipTapEditor from "@/components/shared/editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogUpdateSchema } from "@/features/blogs/blog.validators";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { onActionError } from "@/lib/actions/action.helper";
import SubmitButton from "@/components/custom-ui/submit-button";
import { useDebounce } from "use-debounce";
import slugify from "slugify";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateBlogAction } from "@/features/blogs/blog.actions";
import { BlogUpdateType } from "@/features/blogs/blog.types";

const BlogUpdateForm = ({
  defaultValues,
}: {
  defaultValues: BlogUpdateType;
}) => {
  const form = useForm<BlogUpdateType>({
    resolver: zodResolver(blogUpdateSchema),
    defaultValues,
  });
  const { control, handleSubmit, setValue, watch } = form;

  const { execute, isPending } = useAction(updateBlogAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CREATE.SUCCESS);
    },
    onError: onActionError,
  });

  const editor = useTipTapEditor({
    content: defaultValues.content,
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
  });

  const [isManualSlug, setManualSlug] = React.useState(false);

  const titleValue = watch("title");

  const [debouncedName] = useDebounce(titleValue, 200);

  React.useEffect(() => {
    if (!isManualSlug) {
      setValue("slug", slugify(debouncedName, { lower: true, strict: true }));
    }
  }, [debouncedName, isManualSlug, setValue]);

  if (!editor) return null;

  const onSubmit = (data: BlogUpdateType) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề" {...field} />
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

        <FormField
          control={control}
          name="content"
          render={() => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <div className="border rounded-md p-2">
                <FormControl>
                  <TipTapEditor editor={editor} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isPublished"
          render={({ field: { value, ...rest } }) => (
            <FormItem className="flex gap-2">
              <FormControl>
                <Input
                  className="size-6"
                  type="checkbox"
                  {...rest}
                  checked={value}
                />
              </FormControl>
              <FormLabel>Xuất bản</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nút Submit */}
        <SubmitButton
          label="Lưu bài viết"
          isLoading={isPending}
          disabled={isPending}
        />
        {/* <Button type="submit">Lưu bài viết</Button> */}
      </form>
    </Form>
  );
};

export default BlogUpdateForm;
