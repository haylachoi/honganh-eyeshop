import { Id } from "../../types";
import { CategoryId } from "../categories/category.types";

export type ProductId = Id;
export type ProductPreview = {
  id: ProductId;
  name: string;
  slug: string;
  categoryId: CategoryId;
  categorySlug: string;
  price: number;
};
