import {
  countBlogsByQuery,
  searchBlogsByQuery,
} from "@/features/blogs/blog.queries";
import { PAGE_NUMBER_REGEX, PAGE_SIZE } from "@/constants";
import Image from "next/image";
import { BlogsPagination } from "../_components/blogs-pagination";
import { BlogsContent } from "../_components/blogs-content";
import { notFound, redirect, RedirectType } from "next/navigation";
import { getLink, getPageNumber, getTotalPages } from "@/lib/utils";
import { cache } from "react";
import { MAX_BLOG_PAGES_FOR_STATIC } from "@/features/blogs/blog.contants";

const size = PAGE_SIZE.BLOGS.SM;
const countBlogs = cache(() => countBlogsByQuery(undefined));

export async function generateStaticParams() {
  const result = await countBlogs();
  const total = result.success ? result.data : 0;
  const totalPage = getTotalPages(total, size);
  const min = Math.min(totalPage, MAX_BLOG_PAGES_FOR_STATIC);

  return Array.from({ length: min }, (_, i) => ({
    blogsPageNumber: getPageNumber(i + 1),
  }));
}

export const dynamic = "auto";
export const revalidate = 3600;

type Params = { blogsPageNumber: string };

const BlogsHomePage = async ({ params }: { params: Promise<Params> }) => {
  const { blogsPageNumber } = await params;

  if (!blogsPageNumber || !PAGE_NUMBER_REGEX.test(blogsPageNumber)) {
    return notFound();
  }

  const page = Number(blogsPageNumber.match(PAGE_NUMBER_REGEX)?.[1]);
  const countResult = await countBlogs();
  const total = countResult.success ? countResult.data : 0;
  const totalPage = getTotalPages(total, size);

  if (page > totalPage) {
    redirect(getLink.blog.home({ page: totalPage }), RedirectType.replace);
  }

  const data = await searchBlogsByQuery({ page, size });

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
      <BlogsContent data={data} />
      <BlogsPagination total={total} page={page} size={size} />
    </div>
  );
};

export default BlogsHomePage;
