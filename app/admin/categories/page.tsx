import React from "react";
import CategoriesView from "./_components/categories-view";
import { getAllCategories } from "@/features/categories/category.query";
import { ADMIN_ENDPOINTS } from "@/constants";
import AdminMainTopSection from "@/components/shared/admin/main-top-section";

const CategoryPage = async () => {
  const result = await getAllCategories();

  if (!result.success) {
    return <div>Error</div>;
  }

  const categories = result.data;

  return (
    <div>
      <AdminMainTopSection
        title="Danh sách danh mục"
        addNewLink={`${ADMIN_ENDPOINTS.CATEGORIES}/create`}
      />

      <CategoriesView categories={categories} />
    </div>
  );
};

export default CategoryPage;
