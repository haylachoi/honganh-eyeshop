import { z } from "zod";
import {
  filterGroupSchema,
  filterInputSchema,
  filterTypeSchema,
} from "./filter.validator";

export type FilterType = z.infer<typeof filterTypeSchema>;

export type FilterGroupType = z.infer<typeof filterGroupSchema>;
export type FilterInputType = z.infer<typeof filterInputSchema>;
