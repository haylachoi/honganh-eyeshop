import next_cache from "@/cache";
import { SITE_COUNT, SITEMAP_CONFIG } from "@/constants/sitemap.constants";
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
    const blogs = await next_cache.blogs.all();

    return blogs.map((blog) => ({
      url: getFullLink(
        getLink.blog.view({
          blogSlug: blog.slug,
        }),
      ),
      priority: SITEMAP_CONFIG.BLOG.PRIORITY,
      changeFrequency: SITEMAP_CONFIG.BLOG.CHANGE_FREQUENCY,
      lastModified: blog.updatedAt,
    }));
  }

  return [];
}
