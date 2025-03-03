import { Id } from "@/types";

export type CategoryId = Id;
export type CategoryPreview = {
  id: CategoryId;
  name: string;
  description: string;
  slug: string;
};
