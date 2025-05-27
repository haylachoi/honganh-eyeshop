import { z } from "zod";
import { Id } from "../../types";
import {
  attributeSchema,
  productDbInputSchema,
  productInputSchema,
  productPreviewTypeSchema,
  productTypeSchema,
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

export type ProductInputType = z.infer<typeof productInputSchema>;
export type ProductDbInputType = z.infer<typeof productDbInputSchema>;
export type ProductUpdateType = z.infer<typeof productUpdateSchema>;
export type ProductType = z.infer<typeof productTypeSchema>;
export type AttributeType = z.infer<typeof attributeSchema>;

export type ProductPreview = z.output<typeof productPreviewTypeSchema>;

export type MongoId = string;

export type SimpleCategoryType = {
  _id: MongoId;
  name: string;
  slug: string;
};
