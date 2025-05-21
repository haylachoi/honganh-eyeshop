import { z } from "zod";
import {
  bannersSettingsSchema,
  bannersSettingsUpdateSchema,
  sellersSettingsSchema,
  sellersSettingsUpdateSchema,
  settingsTypeSchema,
  siteSettingsTypeSchema,
  siteSettingsUpdateSchema,
  storesSettingsUpdateSchema,
} from "./settings.validator";

export type SettingsType = z.infer<typeof settingsTypeSchema>;

export type SiteSettingsUpdateType = z.infer<typeof siteSettingsUpdateSchema>;
export type SiteSettingsType = z.infer<typeof siteSettingsTypeSchema>;
export type SiteSettingsDbInputType = SiteSettingsType;

export type SellersSettingsUpdateType = z.infer<
  typeof sellersSettingsUpdateSchema
>;
export type SellersSettingsType = z.infer<typeof sellersSettingsSchema>;
export type SellersSettingsDbInputType = SellersSettingsType;

export type StoresSettingsUpdateType = z.infer<
  typeof storesSettingsUpdateSchema
>;

export type StoresSettingsDbInputType = StoresSettingsUpdateType;

export type BannersSettingsUpdateType = z.infer<
  typeof bannersSettingsUpdateSchema
>;

export type BannersSettingsDbInputType = z.infer<typeof bannersSettingsSchema>;
export type BannersSettingsType = z.infer<typeof bannersSettingsSchema>;
