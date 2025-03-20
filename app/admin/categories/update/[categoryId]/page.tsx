import React from "react";
import CategoryUpdateForm from "@/app/admin/categories/update/[categoryId]/category-form.update";
import { getCategoryById } from "@/features/categories/category.query";

const CategoryUpdatePage = async ({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) => {
  const { categoryId } = await params;
  const result = await getCategoryById(categoryId);
  if (!result.success) {
    return <div>Error</div>;
  }

  const category = result.data;
  return (
    <div>
      <CategoryUpdateForm category={category} />
    </div>
  );
};

export default CategoryUpdatePage;
