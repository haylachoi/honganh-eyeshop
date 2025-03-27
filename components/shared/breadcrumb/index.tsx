import { getAllCategories } from "@/features/categories/category.query";
import { BreadcrumbContent } from "./breadcrumb-content";

const Breadcrumb = async () => {
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.success ? categoriesResult.data : [];
  const dic = {
    blogs: "Tin tức",
    ...Object.fromEntries(categories.map(({ slug, name }) => [slug, name])),
  };
  return (
    <div className="py-2 container">
      <BreadcrumbContent map={dic} />
    </div>
  );
};

export default Breadcrumb;
