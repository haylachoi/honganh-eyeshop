import { MetadataRoute } from "next";

export const SITE_COUNT = {
  CATEGORY: 2,
  BLOG: 1,
};

export const SITEMAP_CONFIG: Record<
  string,
  {
    PRIORITY: number;
    CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]["changeFrequency"];
  }
> = {
  PRODUCT: {
    PRIORITY: 0.7,
    CHANGE_FREQUENCY: "weekly",
  },
  BLOG: {
    PRIORITY: 0.5,
    CHANGE_FREQUENCY: "weekly",
  },
  CATEGORY: {
    PRIORITY: 0.8,
    CHANGE_FREQUENCY: "daily",
  },
  HOME: {
    PRIORITY: 1,
    CHANGE_FREQUENCY: "daily",
  },
  SUPPORT: {
    PRIORITY: 0.8,
    CHANGE_FREQUENCY: "monthly",
  },
};
