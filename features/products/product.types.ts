import { z } from "zod";
import { Id } from "../../types";
import {
  attributeSchema,
  ProductDbInputSchema,
  ProductInputSchema,
  ProductTypeSchema,
  productUpdateSchema,
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
export type ProductDbInputType = z.infer<typeof ProductDbInputSchema>;
export type ProductUpdateType = z.infer<typeof productUpdateSchema>;
export type ProductType = z.infer<typeof ProductTypeSchema>;
export type AttributeType = z.infer<typeof attributeSchema>;

export type ProductPreview = ProductType;

export type MongoId = string;

export type SimpleCategoryType = {
  _id: MongoId;
  name: string;
  slug: string;
};
