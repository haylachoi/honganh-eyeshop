import { z } from "zod";
import {
  tagInputSchema,
  tagTypeSchema,
  tagUpdateSchema,
} from "./tag.validator";

export type TagType = z.output<typeof tagTypeSchema>;

export type TagInputType = z.infer<typeof tagInputSchema>;
export type TagUpdateType = z.infer<typeof tagUpdateSchema>;
