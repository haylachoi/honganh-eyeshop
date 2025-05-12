import { ENDPOINTS } from "@/constants/endpoints.constants";
import { SITE_COUNT, SITEMAP_CONFIG } from "@/constants/sitemap.constants";
import { getFullLink } from "@/lib/utils";
import type { MetadataRoute } from "next";

const buildSitemap = (segment: string, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    url: getFullLink(`${segment}/sitemap/${index}.xml`),
  }));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getFullLink(),
      lastModified: new Date().toISOString(),
      priority: SITEMAP_CONFIG.HOME.PRIORITY,
    },
    ...buildSitemap(ENDPOINTS.CATEGORIES, SITE_COUNT.CATEGORY),
    ...buildSitemap(ENDPOINTS.BLOGS.view, SITE_COUNT.BLOG),
  ];
}
