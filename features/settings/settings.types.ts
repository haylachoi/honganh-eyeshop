import { z } from "zod";
import {
  sellersSettingsUpdateSchema,
  settingsTypeSchema,
  siteSettingsUpdateSchema,
} from "./settings.validator";

export type SettingType = z.infer<typeof settingsTypeSchema>;

export type SiteSettingsUpdateType = z.infer<typeof siteSettingsUpdateSchema>;
export type SiteSettingsDbInputType = SiteSettingsUpdateType;

export type SellersSettingsUpdateType = z.infer<
  typeof sellersSettingsUpdateSchema
>;
export type SellersSettingsDbInputType = SellersSettingsUpdateType;
