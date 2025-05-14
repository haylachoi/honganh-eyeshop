import { z } from "zod";
import {
  bannersSettingsSchema,
  bannersSettingsUpdateSchema,
  sellersSettingsUpdateSchema,
  settingsTypeSchema,
  siteSettingsUpdateSchema,
  storesSettingsUpdateSchema,
} from "./settings.validator";

export type SettingType = z.infer<typeof settingsTypeSchema>;

export type SiteSettingsUpdateType = z.infer<typeof siteSettingsUpdateSchema>;
export type SiteSettingsDbInputType = SiteSettingsUpdateType;

export type SellersSettingsUpdateType = z.infer<
  typeof sellersSettingsUpdateSchema
>;
export type SellersSettingsDbInputType = SellersSettingsUpdateType;

export type StoresSettingsUpdateType = z.infer<
  typeof storesSettingsUpdateSchema
>;

export type StoresSettingsDbInputType = StoresSettingsUpdateType;

export type BannersSettingsUpdateType = z.infer<
  typeof bannersSettingsUpdateSchema
>;

export type BannersSettingsDbInputType = z.infer<typeof bannersSettingsSchema>;
export type BannersSettingsType = z.infer<typeof bannersSettingsSchema>;
