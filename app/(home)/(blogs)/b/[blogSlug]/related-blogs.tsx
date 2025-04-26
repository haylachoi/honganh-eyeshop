"use client";

import { BlogType } from "@/features/blogs/blog.types";
import { CarouselList } from "@/components/shared/carousel-list";
import Blogcard from "@/components/shared/blog-card";

export const RelatedBlogs = ({ blogs }: { blogs: BlogType[] }) => {
  return (
    <CarouselList
      items={blogs}
      columns={{ sm: 1 }}
      render={(blog) => (
        <div className="m-1 shadow-sm">
          <Blogcard blog={blog} />
        </div>
      )}
    />
  );
};
