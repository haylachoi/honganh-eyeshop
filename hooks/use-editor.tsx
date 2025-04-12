"use client";

import { useEditor } from "@tiptap/react";
import { EditorEvents } from "@tiptap/react";
import { TIPTAP_EXTENSIONS } from "@/features/blogs/blog.contants";

type UseTipTapEditorProps = {
  onUpdate?: ((props: EditorEvents["update"]) => void) | undefined;
  content?: string;
};

export default function useTipTapEditor({
  onUpdate,
  content,
}: UseTipTapEditorProps = {}) {
  const editor = useEditor({
    onUpdate: onUpdate,
    editorProps: {
      attributes: {
        class: "blog-container",
      },
    },
    immediatelyRender: false,
    extensions: TIPTAP_EXTENSIONS,
    content,
  });

  return editor;
}
