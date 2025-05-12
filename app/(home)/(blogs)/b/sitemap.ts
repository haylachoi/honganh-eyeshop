import { SITE_COUNT, SITEMAP_CONFIG } from "@/constants/sitemap.constants";
import { getAllBlogs } from "@/features/blogs/blog.queries";
import { getFullLink, getLink } from "@/lib/utils";
import { MetadataRoute } from "next";

export async function generateSitemaps(): Promise<{ id: number }[]> {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return Array.from({ length: SITE_COUNT.CATEGORY }, (_, index) => ({
    id: index,
  }));
}

// 1 file has max 50 000 urls
export default async function sitemap({
  id,
}: {
  id: number | string;
}): Promise<MetadataRoute.Sitemap> {
  if (id == 0) {
    const result = await getAllBlogs();

    if (!result.success) {
      return [];
    }
    const blogs = result.data;
    return blogs.map((blog) => ({
      url: getFullLink(
        getLink.blog.view({
          blogSlug: blog.slug,
        }),
      ),
      priority: SITEMAP_CONFIG.BLOG.PRIORITY,
      changefreq: SITEMAP_CONFIG.BLOG.CHANGE_FREQUENCY,
      lastModified: blog.updatedAt,
    }));
  }

  return [];
}
