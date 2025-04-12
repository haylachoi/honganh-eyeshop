import StarterKit from "@tiptap/starter-kit";
import { FontSizeExtension } from "@/components/shared/editor/extensions/font-size-ext";
import { LineHeightExtension } from "@/components/shared/editor/extensions/line-height-ext";

import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";
import { HeadingWithId } from "@/components/shared/editor/extensions/heading-with-id-ext";

export const TIPTAP_EXTENSIONS = [
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
  HeadingWithId,
];
