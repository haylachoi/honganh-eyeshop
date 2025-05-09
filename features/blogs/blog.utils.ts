import { slugifyVn } from "@/lib/utils";
import { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/core";
import { TIPTAP_EXTENSIONS } from "./blog.contants";
import { TOCEntry } from "./blog.types";
import { Id } from "@/types";
import { Scope } from "../authorization/authorization.constants";
import { ERROR_MESSAGES } from "@/constants/messages.constants";
import { NotFoundError } from "@/lib/error";

export function addHeadingIds(doc: JSONContent): JSONContent {
  const usedIds = new Set<string>();

  function generateUniqueId(baseId: string): string {
    let id = baseId;
    let counter = 1;
    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    usedIds.add(id);
    return id;
  }

  function walk(node: JSONContent): JSONContent {
    const text =
      node.type === "heading" && node.content
        ? node.content.map((n) => n.text || "").join("")
        : "";

    const hasChildren = Array.isArray(node.content);

    const baseId =
      node.type === "heading" && text
        ? slugifyVn(text).slice(0, 60)
        : undefined;

    const uniqueId = baseId ? generateUniqueId(baseId) : undefined;

    return {
      ...node,
      attrs:
        node.type === "heading" && uniqueId
          ? { ...node.attrs, id: uniqueId }
          : node.attrs,
      content: hasChildren ? node.content!.map(walk) : undefined,
    };
  }

  return walk(doc);
}

export function extractTocFromJSON(doc: JSONContent, maxLevel = 2): TOCEntry[] {
  const toc: TOCEntry[] = [];

  function walk(node: JSONContent) {
    if (node.type === "heading" && node.attrs?.id) {
      const text = node.content?.map((n) => n.text || "").join("") ?? "";
      const level = node.attrs.level ?? 1;

      if (level <= maxLevel) {
        toc.push({
          id: node.attrs.id,
          text,
          level,
        });
      }
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  }

  walk(doc);
  return toc;
}

export function generateHtmlAndTOC(doc: JSONContent) {
  const newJSON = addHeadingIds(doc);
  const toc = extractTocFromJSON(newJSON);
  const html = generateHTML(newJSON, TIPTAP_EXTENSIONS);
  return { html, toc };
}

export const validateAction = ({
  blogs,
  userId,
  scopes,
}: {
  blogs: { id: Id; author: { id: Id } }[];
  userId: Id;
  scopes: Scope[];
}) => {
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    if (!blog) {
      throw new NotFoundError({
        resource: "blog",
        message: ERROR_MESSAGES.BLOG.NOT_FOUND,
      });
    }

    if (
      scopes &&
      !scopes.includes("all") &&
      scopes.includes("own") &&
      blog.author.id !== userId
    ) {
      throw new NotFoundError({
        resource: "blog",
        message: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
      });
    }
  }
};
