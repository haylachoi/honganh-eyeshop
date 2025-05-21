import { getAllCategories } from "@/features/categories/category.queries";
import { BreadcrumbContent } from "./breadcrumb-content";

const defaultBreadcrumbsMap: Record<string, { label: string; href: string }> = {
  blogs: { label: "Tin tức", href: "/blogs" },
  b: { label: "Tin tức", href: "/blogs" },
};
const Breadcrumb = async () => {
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  const breadcrumbsMap: Record<string, { label: string; href: string }> = {
    ...defaultBreadcrumbsMap,
    ...Object.fromEntries(
      categories.map(({ slug, name }) => [
        slug,
        { label: name, href: `/c/${slug}` },
      ]),
    ),
  };

  return (
    <div className="container">
      <BreadcrumbContent breadcrumbsMap={breadcrumbsMap} />
    </div>
  );
};

export default Breadcrumb;
