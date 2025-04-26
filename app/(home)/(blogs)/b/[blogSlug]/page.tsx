import {
  getBlogBySlug,
  getPublishedBlogsByTag,
} from "@/features/blogs/blog.queries";
import BlogView from "./blog-view";
import { notFound } from "next/navigation";
import { Id } from "@/types";
import { RelatedBlogs } from "./related-blogs";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";

export const revalidate = 3600;

type params = Promise<{ blogSlug: string }>;

const BlogPage = async ({ params }: { params: params }) => {
  const { blogSlug } = await params;
  const result = await getBlogBySlug(blogSlug);
  if (!result.success || !result.data || !result.data.isPublished) {
    return notFound();
  }
  const blog = result.data;
  return (
    <div className="px-1 max-w-[600px] lg:max-w-[1024px] xl:max-w-[1200px] mx-auto flex flex-col justify-center gap-4">
      <BlogView blog={blog} />
      <div className="grid grid-cols-[100px_1fr] gap-4 my-8">
        {/* todo: add logo */}
        <div>logo</div>
        <div>
          <p className="text-xl font-bold mb-2">Kính mắt Hồng anh</p>
          <p>
            Kính Mắt Hồng Anh tự hào là địa chỉ tin cậy cho những ai yêu thích
            sự tinh tế và chất lượng trong từng sản phẩm kính mắt. Với nhiều năm
            kinh nghiệm, chúng tôi luôn cam kết mang đến những mẫu kính thời
            trang, chính hãng và dịch vụ chăm sóc tận tâm cho từng khách hàng.
          </p>
        </div>
      </div>
      <RelatedBlogsProvider tag={blog.tags[0]} exludeBlogId={blog.id} />
    </div>
  );
};

export default BlogPage;

const RelatedBlogsProvider = async ({
  tag,
  exludeBlogId,
}: {
  tag: string;
  exludeBlogId: Id;
}) => {
  const blogsResult = await getPublishedBlogsByTag({ tag });
  if (!blogsResult.success) {
    return null;
  }
  const blogs = blogsResult.data.items.filter(
    (blog) => blog.id !== exludeBlogId,
  );
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Các bài viết liên quan</h3>
      <RelatedBlogs blogs={blogs} />
    </div>
  );
};
