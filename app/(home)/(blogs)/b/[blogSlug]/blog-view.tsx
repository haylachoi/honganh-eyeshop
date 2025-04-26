"use client";

import { BlogType, TOCEntry } from "@/features/blogs/blog.types";
import { useActiveId } from "@/hooks/use-active-id";
import { cn, dateFormatter } from "@/lib/utils";
import { JSX } from "react";

const BlogView = ({ blog }: { blog: BlogType }) => {
  return (
    <div className="">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl mb-1 font-bold text-primary text-center capitalize">
          {blog.title}
        </h1>
        <div className="flex justify-center gap-2">
          <span className="font-medium">Viết bởi:</span>
          <span className="text-primary/90 capitalize font-medium">
            {blog.author.name}
          </span>
        </div>

        <div className="md:flex gap-4 text-muted-foreground">
          <span>
            Ngày cập nhật: {dateFormatter.format(new Date(blog.updatedAt))}
          </span>
          <ul className="flex gap-2">
            {blog.tags.map((tag) => (
              <li key={tag}>
                <span className="text-primary/90 capitalize">#{tag}</span>
              </li>
            ))}
          </ul>
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
