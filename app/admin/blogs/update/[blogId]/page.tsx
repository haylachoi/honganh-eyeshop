import React from "react";
import BlogUpdateForm from "./blog-form.update";
import { getBlogById } from "@/features/blogs/blog.query";

type params = Promise<{ blogId: string }>;

const BlogUpdatePage = async ({ params }: { params: params }) => {
  const { blogId } = await params;
  const result = await getBlogById(blogId);

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
