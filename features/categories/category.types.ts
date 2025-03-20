import { Id } from "@/types";
import {
  CategoryInputSchema,
  CategoryTypeSchema,
  CategoryUpdateSchema,
} from "./category.validator";
import { z } from "zod";

export type CategoryId = Id;
export type CategoryPreview = {
  id: CategoryId;
  name: string;
  description: string;
  slug: string;
};

export type CategoryAttributeType = {
  name: string;
  displayName: string;
};
// export type CategoryType = {
//   id: Id;
//   name: string;
//   slug: string;
//   description: string;
//   attributes: CategoryAttributeType[];
// };

export type CategoryType = z.output<typeof CategoryTypeSchema>;
export type CategoryInputType = z.infer<typeof CategoryInputSchema>;
export type CategoryUpdateType = z.infer<typeof CategoryUpdateSchema>;
