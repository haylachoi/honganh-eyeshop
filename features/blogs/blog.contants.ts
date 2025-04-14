import StarterKit from "@tiptap/starter-kit";
import { FontSizeExtension } from "@/components/shared/editor/extensions/font-size-ext";
import { LineHeightExtension } from "@/components/shared/editor/extensions/line-height-ext";

import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";
import { HeadingWithId } from "@/components/shared/editor/extensions/heading-with-id-ext";
import { SORT_BY_VALUES } from "@/constants";
import { createUppercaseMap } from "@/lib/utils";

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

export const BLOG_FILTER_NAME_VALUES = [
  "title",
  "slug",
  "author",
  "tags",
] as const;

export const BLOG_FILTER_NAMES = createUppercaseMap(BLOG_FILTER_NAME_VALUES);
export const BLOG_ORDER_BY_VALUES = ["name", "updatedAt"] as const;

export const BLOG_SORTING_OPTIONS = {
  ORDER_BY: createUppercaseMap(BLOG_ORDER_BY_VALUES),
};
