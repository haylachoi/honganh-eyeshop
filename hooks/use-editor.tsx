"use client";

import { useEditor } from "@tiptap/react";
import { EditorEvents } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FontSizeExtension } from "@/components/shared/editor/extensions/font-size-ext";
import { LineHeightExtension } from "@/components/shared/editor/extensions/line-height-ext";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";

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
        class:
          "focus:outline-none print:border-0 flex flex-col min-h-[400px] w-full py-4 cursor-text",
      },
    },
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),

      FontSizeExtension,
      TextStyle,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      ImageResize,
    ],
    content,
  });

  return editor;
}
