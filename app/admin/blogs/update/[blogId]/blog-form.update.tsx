"use client";

import React from "react";
import { useForm, useFormContext } from "react-hook-form";
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
import { ADMIN_ENDPOINTS, TOAST_MESSAGES } from "@/constants";
import { onActionError } from "@/lib/actions/action.helper";
import SubmitButton from "@/components/custom-ui/submit-button";
import { useDebounce } from "use-debounce";
import slugify from "slugify";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateBlogAction } from "@/features/blogs/blog.actions";
import { BlogUpdateType } from "@/features/blogs/blog.types";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import { compressImage } from "@/lib/utils";
import { useImageSourceStore } from "@/hooks/use-image-source";
import { useRouter } from "next/navigation";
import { generateHtmlAndTOC } from "@/features/blogs/blog.utils";
import FormTextArea from "@/components/shared/form/form-text-area";
import { TagInput } from "../../_components/input-tags";

const BlogUpdateForm = ({
  defaultValues,
}: {
  defaultValues: BlogUpdateType;
}) => {
  const router = useRouter();
  const form = useForm<BlogUpdateType>({
    resolver: zodResolver(blogUpdateSchema),
    defaultValues,
  });
  const { control, handleSubmit, setValue, watch } = form;
  const { execute, isPending } = useAction(updateBlogAction, {
    onSuccess: () => {
      router.push(ADMIN_ENDPOINTS.BLOGS);
      toast.success(TOAST_MESSAGES.UPDATE.SUCCESS);
    },
    onError: onActionError,
  });

  const editor = useTipTapEditor({
    content: defaultValues.content,
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
  });
  const imageSources = useImageSourceStore((state) => state.imageSources);

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
    const tiptap = document.querySelector(".tiptap");
    if (!tiptap) return;

    const imageElements = tiptap.querySelectorAll("img");

    const oldImages: string[] = [];

    imageElements.forEach((img) => {
      const src = img.src;
      const parsedUrl = new URL(src);
      if (defaultValues.images.includes(parsedUrl.pathname)) {
        oldImages.push(parsedUrl.pathname);
        return;
      }

      data.imageSources.push({
        fakeUrl: src,
        file:
          imageSources.find(({ fakeUrl }) => fakeUrl === src)?.file ??
          new File([], src),
      });
    });
    data.images = oldImages;

    const { html, toc } = generateHtmlAndTOC(editor.getJSON());
    data.content = html;
    data.toc = toc;

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

        <FormTextArea
          control={control}
          name="description"
          label="Mô tả"
          placeholder="Nhập mô tả"
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
          name="tags"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Thêm tag..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageUploader />

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

const ImageUploader = () => {
  const form = useFormContext<BlogUpdateType>();
  const { watch, control } = form;
  const oldImage = watch("wallImage");
  const [previewImage, setImagePreview] = React.useState<string | undefined>(
    typeof oldImage === "string" ? oldImage : undefined,
  );
  const [, setFile] = React.useState<File | undefined>();

  React.useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormField
      control={control}
      name="wallImage"
      render={({ field: { ref, name, onBlur, onChange } }) => (
        <FormItem className="mt-4">
          <FormLabel>Ảnh</FormLabel>
          {previewImage && (
            <div className="relative size-[150px]">
              <Image
                width={150}
                height={150}
                alt="preview"
                className="size-full object-cover"
                src={previewImage}
              />
              <button
                type="button"
                className="absolute top-1 right-1 z-10 cursor-pointer size-8 grid place-content-center text-sm bg-destructive text-destructive-foreground opacity-90 rounded-sm"
                onClick={() => {
                  URL.revokeObjectURL(previewImage);
                  setImagePreview(undefined);
                  setFile(undefined);
                  onChange(undefined);
                }}
              >
                <TrashIcon className="h-full w-full" />
              </button>
            </div>
          )}
          <FormControl>
            <label className="inline-block w-max px-4 py-2 bg-secondary rounded-md cursor-pointer shadow-sm">
              Up ảnh
              <Input
                className="hidden"
                accept="image/*"
                type="file"
                name={name}
                ref={ref}
                onBlur={onBlur}
                onChange={async (e) => {
                  if (!e.target.files) return;

                  const newFile = e.target.files[0];
                  const compressedFile = await compressImage(newFile, 0.7, 800);

                  const url = URL.createObjectURL(compressedFile);

                  setImagePreview(url);
                  setFile(compressedFile);
                  onChange(compressedFile);
                  e.target.value = "";
                }}
              />
            </label>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
