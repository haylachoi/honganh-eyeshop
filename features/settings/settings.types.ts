import { z } from "zod";
import {
  sellersSettingsUpdateSchema,
  siteSettingsUpdateSchema,
} from "./settings.validator";

export type SiteSettingsUpdateType = z.infer<typeof siteSettingsUpdateSchema>;
export type SiteSettingsDbInputType = SiteSettingsUpdateType;

export type SellersSettingsUpdateType = z.infer<
  typeof sellersSettingsUpdateSchema
>;
export type SellersSettingsDbInputType = SellersSettingsUpdateType;
