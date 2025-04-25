"use client";

import { EditorContent } from "@tiptap/react";
import EditorToolbar from "./editor-toolbar";
import { Editor } from "@tiptap/core";

const TipTapEditor = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <div className="space-y-4">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
