import { z } from "zod";
import { STORE_TYPES_LIST } from "./settings.constants";

// export const SettingInputSchema = z.object({
//   // common: z.object({
//   //   pageSize: z.coerce
//   //     .number()
//   //     .min(1, "Page size must be at least 1")
//   //     .default(9),
//   //   freeShippingPrice: z.coerce
//   //     .number()
//   //     .min(0, "Free shipping price must be at least 0")
//   //     .default(0),
//   // }),
//   site: z.object({
//     name: z.string().min(1, "Name is required"),
//     logo: z.string().min(1, "logo is required"),
//     slogan: z.string().min(1, "Slogan is required"),
//     description: z.string().min(1, "Description is required"),
//     email: z.string().min(1, "Email is required"),
//     phone: z.string().min(1, "Phone is required"),
//     // copyright: z.string().min(1, "Copyright is required"),
//     address: z.string().min(1, "Address is required"),
//   }),
//
//   defaultCurrency: z.string().min(1, "Currency is required"),
// });

export const siteSettingsUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().min(1, "logo is required"),
  slogan: z.string().min(1, "Slogan is required"),
  description: z.string().min(1, "Description is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  // copyright: z.string().min(1, "Copyright is required"),
  address: z.string().min(1, "Address is required"),

  businessRegistrationNumber: z.string().optional().default(""),
  legalRepresentative: z.string().optional().default(""),
});

export const sellerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  facebook: z.string().min(1, "Facebook is required"),
  isActive: z.boolean().default(true),
});

export const sellersSettingsUpdateSchema = z.array(sellerSchema);

export const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().optional(),

  type: z
    .enum(STORE_TYPES_LIST, {
      required_error: "Store type is required",
    })
    .default(STORE_TYPES_LIST[0]),

  addressInfo: z.object({
    address: z.string().min(1, "Address is required"),
    district: z.string().min(1, "District is required"),
    province: z.string().min(1, "Province is required"),
    postalCode: z.string().optional(),
  }),

  contactInfo: z
    .object({
      phone: z.string().optional().default(""),
      email: z
        .union([z.string().email("Invalid email"), z.literal("")])
        .optional()
        .default(""),
      facebook: z
        .union([z.string().url("Invalid URL"), z.literal("")])
        .optional()
        .default(""),
      zalo: z
        .union([z.string().url("Invalid URL"), z.literal("")])
        .optional()
        .default(""),
    })
    .optional()
    .default({
      phone: "",
      email: "",
      facebook: "",
      zalo: "",
    }),

  location: z.object({
    latitude: z.coerce
      .number()
      .min(-90, "Latitude must be ≥ -90")
      .max(90, "Latitude must be ≤ 90"),
    longitude: z.coerce
      .number()
      .min(-180, "Longitude must be ≥ -180")
      .max(180, "Longitude must be ≤ 180"),
    googleMapLink: z.union([z.string().url(), z.literal("")]).optional(),
  }),

  openingHours: z.string().optional(),
  isOpenNow: z.boolean().optional(),
});

export const storesSettingsUpdateSchema = z.array(storeSchema);

export const settingsTypeSchema = z.object({
  site: siteSettingsUpdateSchema.optional(),
  sellers: sellersSettingsUpdateSchema.default([]),
  stores: storesSettingsUpdateSchema.default([]),
});
