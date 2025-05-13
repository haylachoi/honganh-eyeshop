import { z } from "zod";
import {
  supportPageUpdateSchema,
  supportPageTypeSchema,
} from "./support-pages.validator";

export type SupportPageType = z.infer<typeof supportPageTypeSchema>;
export type SupportPageUpdateType = z.infer<typeof supportPageUpdateSchema>;
