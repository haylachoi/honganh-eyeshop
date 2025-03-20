import { getBlogBySlug } from "@/features/blogs/blog.query";
import BlogView from "./blog-view";

type params = Promise<{ blogSlug: string }>;

const BlogPage = async ({ params }: { params: params }) => {
  const { blogSlug } = await params;
  const result = await getBlogBySlug(blogSlug);
  if (!result.success) {
    return <div>Blog không tồn tại</div>;
  }
  const blog = result.data;
  return <BlogView blog={blog} />;
};

export default BlogPage;
