import { searchBlogsByQuery } from "@/features/blogs/blog.queries";
import { BlogsContent } from "./_components/blogs-content";
import { PAGE_SIZE } from "@/constants";
import { BlogsPagination } from "./_components/blogs-pagination";
import Image from "next/image";
import { BLOG_FILTER_NAMES } from "@/features/blogs/blog.contants";
import { getLink } from "@/lib/utils";
import { Metadata } from "next";

const size = PAGE_SIZE.BLOGS.SM;
const page = 1;

export const metadata: Metadata = {
  title: "Blog | Hồng Anh - Chia sẻ kiến thức, mẹo hay",
  description:
    "Tổng hợp các bài viết mới nhất về kính, thời trang và mẹo hay cho bạn từ Hồng Anh.",
  openGraph: {
    title: "Blog | Hồng Anh",
    description:
      "Khám phá các bài viết chia sẻ kiến thức mới nhất từ Hồng Anh.",
    url: getLink.blog.home({
      page: 1,
    }),
    type: "website",
    images: [
      {
        url: "/blogs-home-page.webp",
        width: 1200,
        height: 630,
        alt: "Hồng Anh Blog",
      },
    ],
  },
};

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
