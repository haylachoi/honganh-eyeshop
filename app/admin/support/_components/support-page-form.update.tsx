"use client";

import dynamic from "next/dynamic";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SupportPageUpdateType } from "@/features/support-pages/support-pages.types";
import { supportPageUpdateSchema } from "@/features/support-pages/support-pages.validator";
import { Suspense } from "react";
import useTipTapEditor from "@/hooks/use-editor";
import { createOrUpdateSupportPagesAction } from "@/features/support-pages/support-pages.actions";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import SubmitButton from "@/components/custom-ui/submit-button";
import { useImageSourceStore } from "@/hooks/use-image-source";
import { generateHtmlAndTOC } from "@/features/blogs/blog.utils";
import FormTextInput from "@/components/shared/form/form-text-input";
import FormCheckbox from "@/components/shared/form/form-check-box";

const TipTapEditor = dynamic(() => import("@/components/shared/editor"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export const SupportPageFormUpdate = ({
  defaultValues,
}: {
  defaultValues: SupportPageUpdateType;
}) => {
  const form = useForm<SupportPageUpdateType>({
    resolver: zodResolver(supportPageUpdateSchema),
    defaultValues,
  });

  const { control, handleSubmit, setValue } = form;

  const { execute, isPending } = useAction(createOrUpdateSupportPagesAction, {
    onSuccess: () => {
      toast.success("Thông tin của trang được cập nhật thành công");
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
  const onSubmit = (data: SupportPageUpdateType) => {
    const tiptap = document.querySelector(".tiptap");
    if (!tiptap || !editor) return;

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
    data.deletedImages = defaultValues.images.filter(
      (image) => !oldImages.includes(image),
    );

    const { html } = generateHtmlAndTOC(editor.getJSON());
    data.content = html;

    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormTextInput
          control={control}
          name="title"
          label="Tiêu đề"
          placeholder="Nhập tiêu đề"
        />
        <FormCheckbox
          control={control}
          name="isPublished"
          label="Đã xuất bản"
        />

        <FormCheckbox
          control={control}
          name="showFooter"
          label="Hiển thị footer"
        />

        <FormField
          control={control}
          name="content"
          render={() => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <div className="border rounded-md p-2">
                <FormControl>
                  {editor && (
                    <Suspense fallback={<div>Loading...</div>}>
                      <TipTapEditor editor={editor} />
                    </Suspense>
                  )}
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton label="Cập nhật" isLoading={isPending} />
      </form>
    </Form>
  );
};
