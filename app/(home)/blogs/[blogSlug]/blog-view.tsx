"use client";

import { BlogType, TOCEntry } from "@/features/blogs/blog.types";
import { useActiveId } from "@/hooks/use-active-id";
import { cn, dateFormatter } from "@/lib/utils";
import { SquarePen, Timer } from "lucide-react";
import { JSX } from "react";

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

  // Hàm để xây dựng cấu trúc phân cấp
  const renderTOC = (items: TOCEntry[], parentLevel: number = 1) => {
    const result: JSX.Element[] = [];
    let i = 0;

    while (i < items.length) {
      const item = items[i];

      // Chỉ xử lý các mục có level lớn hơn hoặc bằng parentLevel
      if (item.level < parentLevel) {
        i++;
        continue;
      }

      if (item.level === parentLevel) {
        // Tạo danh sách con cho các mục có level cao hơn
        const subItems: TOCEntry[] = [];
        let j = i + 1;
        while (j < items.length && items[j].level > parentLevel) {
          subItems.push(items[j]);
          j++;
        }

        result.push(
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "font-medium",
                item.level === 2 && "font-normal",
                item.level === 3 && "font-normal text-sm",
                item.level > 3 && "font-normal text-sm",
                activeId === item.id && "underline",
              )}
            >
              {item.text}
            </a>
            {subItems.length > 0 && (
              <ol
                className={cn(
                  "space-y-1 list-inside",
                  item.level === 1 && "ml-4 list-[lower-alpha]",
                  item.level === 2 && "ml-8 list-[lower-roman]",
                  item.level >= 3 && "ml-12 list-decimal",
                )}
              >
                {renderTOC(subItems, parentLevel + 1)}
              </ol>
            )}
          </li>,
        );
        i = j;
      } else {
        i++;
      }
    }

    return result;
  };

  return (
    <nav className="hidden lg:block p-4 bg-white border border-foreground sticky top-2 h-max">
      <h2 className="text-lg font-semibold mb-2">Mục lục</h2>
      <ol className="space-y-1 list-decimal list-inside">{renderTOC(toc)}</ol>
    </nav>
  );
};
