import { Id } from "..";
import { CategoryId } from "../categories";

export type ProductId = Id;
export type ProductPreview = {
  id: ProductId;
  name: string;
  slug: string;
  categoryId: CategoryId;
  categorySlug: string;
  price: number;
};
