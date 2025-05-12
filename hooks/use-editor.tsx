"use client";

import { useEditor } from "@tiptap/react";
import { EditorEvents } from "@tiptap/react";
import { TIPTAP_EXTENSIONS } from "@/features/blogs/blog.contants";

type UseTipTapEditorProps = {
  onUpdate?: ((props: EditorEvents["update"]) => void) | undefined;
  content?: string;
  type?: "blog" | "page";
};

export default function useTipTapEditor({
  onUpdate,
  content,
  type = "blog",
}: UseTipTapEditorProps = {}) {
  const className = type === "blog" ? "blog-container" : "page-container";
  const editor = useEditor({
    onUpdate: onUpdate,
    editorProps: {
      attributes: {
        class: className,
      },
    },
    immediatelyRender: false,
    extensions: TIPTAP_EXTENSIONS,
    content,
  });

  return editor;
}
