import { searchBlogsByQuery } from "@/features/blogs/blog.queries";
import { APP_NAME, PAGE_SIZE } from "@/constants";
import Image from "next/image";
import { BLOG_FILTER_NAMES } from "@/features/blogs/blog.contants";
import { BlogsContent } from "../../_components/blogs-content";
import { BlogsPagination } from "../../_components/blogs-pagination";
import { getFullLink, getLink } from "@/lib/utils";
import { Metadata } from "next";

const size = PAGE_SIZE.BLOGS.SM;
const page = 1;

type Params = {
  blogTag: string;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> => {
  const { blogTag } = await params;
  return {
    title: "Blog | Hồng Anh - Chia sẻ kiến thức, mẹo hay",
    description: `Tổng hợp các bài viết mới nhất về kính, thời trang và mẹo hay cho bạn liên quan đến #${blogTag} từ Hồng Anh.`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      locale: "vi_VN",
      type: "article",
      siteName: APP_NAME,
      url: getFullLink(getLink.blog.home({ page: 1, tag: blogTag })),
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
};

const BlogsPage = async ({ params }: { params: Promise<Params> }) => {
  const { blogTag } = await params;
  const result = await searchBlogsByQuery({
    params: {
      [BLOG_FILTER_NAMES.TAGS]: blogTag,
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
          <p className="text-2xl"># {blogTag}</p>
        </div>
      </div>
      <BlogsContent items={items} />
      <BlogsPagination
        total={total}
        page={Number(page)}
        size={Number(size)}
        tag={blogTag}
      />
    </div>
  );
};

export default BlogsPage;
