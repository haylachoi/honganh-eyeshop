import { getBlogBySlug } from "@/features/blogs/blog.queries";
import BlogView from "./blog-view";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";

export const revalidate = 3600;

type params = Promise<{ blogSlug: string }>;

const BlogPage = async ({ params }: { params: params }) => {
  const { blogSlug } = await params;
  const result = await getBlogBySlug(blogSlug);
  if (!result.success || result.data === null) {
    return <div>Blog không tồn tại</div>;
  }
  const blog = result.data;
  return <BlogView blog={blog} />;
};

export default BlogPage;
