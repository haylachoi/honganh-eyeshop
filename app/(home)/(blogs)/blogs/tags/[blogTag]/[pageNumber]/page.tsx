import { searchBlogsByQuery } from "@/features/blogs/blog.queries";
import { APP_NAME, PAGE_SIZE } from "@/constants";
import Image from "next/image";
import { notFound, redirect, RedirectType } from "next/navigation";
import { getLink, getTotalPages } from "@/lib/utils";
import { BLOG_FILTER_NAMES } from "@/features/blogs/blog.contants";
import { PAGE_NUMBER_REGEX } from "@/constants/regex";
import { BlogsContent } from "../../../_components/blogs-content";
import { BlogsPagination } from "../../../_components/blogs-pagination";
import { Metadata } from "next";
import { getSettings } from "@/features/settings/settings.services";

const size = PAGE_SIZE.BLOGS.SM;

type Params = { blogTag: string; pageNumber: string };

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> => {
  const { blogTag, pageNumber } = await params;
  const page = Number(pageNumber.match(PAGE_NUMBER_REGEX)?.[1]);
  const settings = await getSettings();
  const appName = settings?.site?.name || APP_NAME;

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
      siteName: appName,
      url: getLink.blog.home({ page, tag: blogTag }),
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

const BlogsHomePage = async ({ params }: { params: Promise<Params> }) => {
  const { blogTag, pageNumber } = await params;

  if (!pageNumber || !PAGE_NUMBER_REGEX.test(pageNumber)) {
    return notFound();
  }

  const page = Number(pageNumber.match(PAGE_NUMBER_REGEX)?.[1]);
  const result = await searchBlogsByQuery({
    params: {
      [BLOG_FILTER_NAMES.TAGS]: blogTag,
      [BLOG_FILTER_NAMES.ISPUBLISHED]: "1",
    },
    page: Number(page),
    size: size,
  });

  if (!result.success) {
    throw new Error("Something went wrong");
  }

  const total = result.data.total;
  const totalPage = getTotalPages(total, size);

  if (page > totalPage) {
    redirect(getLink.blog.home({ page: totalPage }), RedirectType.replace);
  }

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
      <BlogsPagination total={total} page={page} size={size} tag={blogTag} />
    </div>
  );
};

export default BlogsHomePage;
