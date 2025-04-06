import { z } from "zod";
import { Id } from "../../types";
import {
  ProductInputSchema,
  ProductTypeSchema,
  productUpdateSchema,
  searchProductResultSchema,
} from "./product.validator";
export type ProductId = Id;
// export type ProductPreview = {
//   id: ProductId;
//   name: string;
//   imageUrl: string;
//   slug: string;
//   categoryId: CategoryId;
//   categorySlug: string;
//   price: number;
//   originPrice: number;
// };

export type ProductInputType = z.infer<typeof ProductInputSchema>;
export type ProductUpdateType = z.infer<typeof productUpdateSchema>;
export type ProductType = z.infer<typeof ProductTypeSchema>;

export type ProductPreview = ProductType;

export type MongoId = string;

export type SimpleCategoryType = {
  _id: MongoId;
  name: string;
  slug: string;
};

export type searchProductResultType = z.output<
  typeof searchProductResultSchema
>;
