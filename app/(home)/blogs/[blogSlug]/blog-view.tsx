"use client";

import { BlogType, TOCEntry } from "@/features/blogs/blog.types";
import { useActiveId } from "@/hooks/use-active-id";
import { cn, dateFormatter } from "@/lib/utils";
import { SquarePen, Timer } from "lucide-react";

const BlogView = ({ blog }: { blog: BlogType }) => {
  return (
    <div className="container flex flex-col gap-4">
      <div>
        <h1 className="text-4xl mb-1 font-bold">{blog.title}</h1>
        <div className="flex items-center gap-6">
          <p className="flex gap-2 items-center">
            <SquarePen /> {blog.author.name}
          </p>
          <p className="flex gap-2 items-center">
            <Timer />
            {dateFormatter.format(new Date(blog.updatedAt))}
          </p>
        </div>
      </div>
      <div className="md:grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="blog-container">
          <div
            className="blog_post"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>
        </div>
        <TOC toc={blog.toc} />
      </div>
    </div>
  );
};

export default BlogView;

const TOC = ({ toc }: { toc: TOCEntry[] }) => {
  const activeId = useActiveId(toc.map((item) => item.id));
  if (toc.length === 0) return null;

  return (
    <nav className="hidden lg:block p-4 bg-white border border-foreground sticky top-2 h-max">
      <h2 className="text-lg font-semibold mb-2">Mục lục</h2>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li
            key={item.id}
            className={cn(
              "font-medium",
              item.level === 2 && "ml-2 font-normal",
              activeId === item.id && "underline",
            )}
          >
            <a
              href={`#${item.id}`}
              className="hover:text-blue-600 text-gray-800"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
