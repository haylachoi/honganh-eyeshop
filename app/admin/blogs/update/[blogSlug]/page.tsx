import React from "react";
import BlogUpdateForm from "./blog-form.update";
import { getBlogBySlug } from "@/features/blogs/blog.query";

type params = Promise<{ blogSlug: string }>;

const BlogUpdatePage = async ({ params }: { params: params }) => {
  const { blogSlug } = await params;
  const result = await getBlogBySlug(blogSlug);

  if (!result.success) {
    return <div>Blog không tồn tại</div>;
  }

  const { author, ...rest } = result.data;

  return (
    <BlogUpdateForm
      defaultValues={{
        ...rest,
        authorId: author.id,
      }}
    />
  );
};

export default BlogUpdatePage;
