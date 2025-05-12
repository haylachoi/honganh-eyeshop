import { ENDPOINTS } from "@/constants/endpoints.constants";
import { getFullLink } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        ENDPOINTS.PROFILE.USER_INFO,
        ENDPOINTS.PROFILE.USER_PASSWORD,
        ENDPOINTS.PROFILE.USER_ADDRESS,
      ],
    },
    sitemap: getFullLink("sitemap.xml"),
  };
}
