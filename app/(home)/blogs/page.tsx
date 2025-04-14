import {
  countBlogsByQuery,
  searchBlogsByQuery,
} from "@/features/blogs/blog.queries";
import { BlogsContent } from "./blogs-content";
import { SearchParams } from "@/types";
import { normalizeSearchParamsToString } from "@/lib/utils";
import { PAGE_SIZE } from "@/constants";
import { BlogsPagination } from "./blogs-pagination";

const BlogsPage = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const {
    tags,
    page = 1,
    size = PAGE_SIZE.BLOGS.SM,
  } = normalizeSearchParamsToString(searchParams);
  const blogsCount = await countBlogsByQuery({
    params: {
      tags: tags ? tags : "",
    },
  });

  const total = blogsCount.success ? blogsCount.data : 0;

  const data = await searchBlogsByQuery({
    params: {
      tags: tags ?? "",
    },
    page: Number(page),
    size: Number(size),
  });
  // todo: add #tags section and recent blogs
  return (
    <div className="container flex flex-col gap-4">
      <BlogsPagination total={total} page={Number(page)} size={Number(size)} />
      <BlogsContent data={data} />
    </div>
  );
};

export default BlogsPage;
