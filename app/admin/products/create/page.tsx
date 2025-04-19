import React from "react";
import ProductCreateForm from "./product-form.create";
import Link from "next/link";
import { ADMIN_ENDPOINTS } from "@/constants";
import { getAllTags } from "@/features/tags/tag.queries";
import { getAllCategories } from "@/features/categories/category.queries";

const CreateProductPage = async () => {
  const [categoriesResult, tagsResult] = await Promise.all([
    getAllCategories(),
    getAllTags(),
  ]);

  if (!categoriesResult.success || !tagsResult.success) {
    return <div>Error</div>;
  }
  const categories = categoriesResult.data;
  const tags = tagsResult.data;

  if (!categories.length) {
    return (
      <div>
        <h3>Chưa có danh mục nào</h3>
        <Link href={`${ADMIN_ENDPOINTS.CATEGORIES}/create`}>
          Vui lòng tạo danh mục để tiếp tục
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <ProductCreateForm {...{ categories, tags }} />
    </div>
  );
};

export default CreateProductPage;
