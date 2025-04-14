import React, { Suspense } from "react";
import BlogUpdateForm from "./blog-form.update";
import { getBlogById } from "@/features/blogs/blog.queries";

type params = Promise<{ blogId: string }>;

const BlogUpdatePage = async ({ params }: { params: params }) => {
  const { blogId } = await params;
  const result = await getBlogById(blogId);

  if (!result.success || result.data === null) {
    return <div>Blog không tồn tại</div>;
  }

  const { author, ...rest } = result.data;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogUpdateForm
        defaultValues={{
          ...rest,
          authorId: author.id,
          imageSources: [],
        }}
      />
    </Suspense>
  );
};

export default BlogUpdatePage;
