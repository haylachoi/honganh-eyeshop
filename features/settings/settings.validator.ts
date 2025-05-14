import { z } from "zod";

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
});

export const sellersSettingsUpdateSchema = z.array(sellerSchema);

export const storeAddressSchema = z.object({});

export const settingsTypeSchema = z.object({
  site: siteSettingsUpdateSchema,
  sellers: sellersSettingsUpdateSchema.default([]),
});
