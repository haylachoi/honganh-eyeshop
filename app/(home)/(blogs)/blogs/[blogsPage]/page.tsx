import {
  countBlogsByQuery,
  searchBlogsByQuery,
} from "@/features/blogs/blog.queries";
import { PAGE_NUMBER_REGEX, PAGE_SIZE } from "@/constants";
import Image from "next/image";
import { BlogsPagination } from "../_components/blogs-pagination";
import { BlogsContent } from "../_components/blogs-content";
import { notFound, redirect, RedirectType } from "next/navigation";
import { getLink, getTotalPages } from "@/lib/utils";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";

export const revalidate = 3600;

type Params = Promise<{ blogsPage: string }>;
const size = PAGE_SIZE.BLOGS.SM;

const BlogsPage = async (props: { params: Promise<Params> }) => {
  const { blogsPage } = await props.params;
  const pageMatch = blogsPage.match(PAGE_NUMBER_REGEX);
  if (!blogsPage || !pageMatch) {
    return notFound();
  }

  const page = Number(pageMatch[1]);

  const tags = "";
  const blogsCount = await countBlogsByQuery({
    params: {
      tags: tags ? tags : "",
    },
  });

  const total = blogsCount.success ? blogsCount.data : 0;
  const totalPage = getTotalPages(total, size);

  if (page > totalPage) {
    redirect(getLink.blog.home({ page: totalPage }), RedirectType.replace);
  }

  const data = await searchBlogsByQuery({
    params: {
      tags: tags ?? "",
    },
    page: Number(page),
    size: size,
  });
  // todo: add #tags section and recent blogs
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
      <BlogsPagination total={total} page={Number(page)} size={Number(size)} />
    </div>
  );
};

export default BlogsPage;
