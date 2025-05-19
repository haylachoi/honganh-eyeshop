import { searchBlogsByQuery } from "@/features/blogs/blog.queries";
import { BlogsContent } from "./_components/blogs-content";
import { PAGE_SIZE } from "@/constants";
import { BlogsPagination } from "./_components/blogs-pagination";
import Image from "next/image";
import { BLOG_FILTER_NAMES } from "@/features/blogs/blog.contants";

const size = PAGE_SIZE.BLOGS.SM;
const page = 1;

const BlogsPage = async () => {
  const result = await searchBlogsByQuery({
    params: {
      [BLOG_FILTER_NAMES.ISPUBLISHED]: "1",
    },
    page: Number(page),
    size: size,
  });

  if (!result.success) {
    throw new Error("Blogs not found");
  }

  const total = result.data.total;
  const items = result.data.items;

  return (
    <div className="container flex flex-col gap-4">
      <div className="lg:grid grid-cols-2">
        <Image
          className="w-full"
          src="/blogs-home-page.webp"
          alt="blogs"
          width={1000}
          height={700}
        />
        <div className="p-10 bg-primary/70 text-primary-foreground flex flex-col items-center justify-center gap-4">
          <h3 className="text-4xl font-bold">Hồng Anh Blogs</h3>
          <p>
            Khám phá những mẹo hay và thủ thuật hữu ích trên blog của chúng tôi
            — nơi giải đáp mọi thắc mắc của bạn.
          </p>
        </div>
      </div>
      <BlogsContent items={items} />
      <BlogsPagination total={total} page={Number(page)} size={Number(size)} />
    </div>
  );
};

export default BlogsPage;
