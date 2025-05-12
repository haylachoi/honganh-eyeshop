import { SITE_COUNT, SITEMAP_CONFIG } from "@/constants/sitemap.constants";
import { getAllCategories } from "@/features/categories/category.queries";
import { getAllProducts } from "@/features/products/product.queries";
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
    const result = await getAllProducts();

    if (!result.success) {
      return [];
    }
    const products = result.data;
    return products.map((product) => ({
      url: getFullLink(
        getLink.product.home({
          categorySlug: product.category.slug,
          productSlug: product.slug,
        }),
      ),
      priority: SITEMAP_CONFIG.PRODUCT.PRIORITY,
      changefreq: SITEMAP_CONFIG.PRODUCT.CHANGE_FREQUENCY,
      lastModified: product.updatedAt,
    }));
  }

  if (id == 1) {
    const result = await getAllCategories();
    if (!result.success) {
      return [];
    }
    const categories = result.data;
    return categories.map((category) => ({
      url: getFullLink(
        getLink.category.home({
          categorySlug: category.slug,
        }),
      ),
      priority: SITEMAP_CONFIG.CATEGORY.PRIORITY,
      changefreq: SITEMAP_CONFIG.CATEGORY.CHANGE_FREQUENCY,
      lastModified: category.updatedAt,
    }));
  }

  return [];
}
