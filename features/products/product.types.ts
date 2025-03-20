import { z } from "zod";
import { Id } from "../../types";
import {
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
export type ProductUpdateType = z.infer<typeof productUpdateSchema>;
export type ProductType = z.infer<typeof ProductTypeSchema>;

export type ProductPreview = ProductType;

export type MongoId = string;

export type SimpleCategoryType = {
  _id: MongoId;
  name: string;
  slug: string;
};

// export type AttributeType = {
//   name: string;
//   value: string;
// };
//
// export type VariantType = {
//   key: string;
//   value: string;
//   price: MoneyType;
//   countInStock: number;
// };
//
// export type RatingDistributionType = {
//   rating: number;
//   count: number;
// };
//
// export type ProductType = {
//   id: string;
//   name: string;
//   slug: string;
//   category: SimpleCategoryType;
//   attributes: AttributeType[];
//   images: string[];
//   brand: string;
//   description: string;
//   isPublished: boolean;
//   tags: string[];
//   variants: VariantType[];
//   avgRating: number;
//   numReviews: number;
//   ratingDistribution: RatingDistributionType[];
//   // // reviews: ReviewType[];
//   numSales: number;
// };
