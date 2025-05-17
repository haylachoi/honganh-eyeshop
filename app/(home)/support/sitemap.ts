import { SITEMAP_CONFIG } from "@/constants/sitemap.constants";
import { AVAILABEL_SUPPORT_PAGES } from "@/features/support-pages/support-pages.constants";
import { getFullLink, getLink } from "@/lib/utils";
import { MetadataRoute } from "next";

export async function generateSitemaps(): Promise<{ id: number }[]> {
  return [
    {
      id: 0,
    },
  ];
}

// 1 file has max 50 000 urls
export default async function sitemap({}: {
  id: number | string;
}): Promise<MetadataRoute.Sitemap> {
  const result = AVAILABEL_SUPPORT_PAGES.map((page) => ({
    url: getFullLink(getLink.support.home({ supportSlug: page.slug })),
    priority: SITEMAP_CONFIG.SUPPORT.PRIORITY,
    changeFrequency: SITEMAP_CONFIG.SUPPORT.CHANGE_FREQUENCY,
    lastModified: new Date().toISOString(),
  }));

  return result;
}
