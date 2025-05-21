import { z } from "zod";
import {
  ANCHOR_LIST,
  SOCIAL_TYPES_LIST,
  STORE_TYPES_LIST,
} from "./settings.constants";

const socialMediaSchema = z
  .union([z.string().url("Invalid URL"), z.literal("")])
  .optional()
  .default("");

export const siteSettingsUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.union([z.string(), z.instanceof(File)]),
  slogan: z.string().min(1, "Slogan is required"),
  description: z.string().min(1, "Description is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  // copyright: z.string().min(1, "Copyright is required"),
  address: z.string().min(1, "Address is required"),

  businessRegistrationNumber: z.string().optional().default(""),
  legalRepresentative: z.string().optional().default(""),
  socialLinks: z
    .array(
      z.object({
        name: z.string(),
        url: socialMediaSchema,
        type: z.enum(SOCIAL_TYPES_LIST),
        icon: z.union([z.string(), z.instanceof(File)]),
      }),
    )
    .default([]),
});

export const siteSettingsTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string(),
  slogan: z.string().min(1, "Slogan is required"),
  description: z.string().min(1, "Description is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  // copyright: z.string().min(1, "Copyright is required"),
  address: z.string().min(1, "Address is required"),

  businessRegistrationNumber: z.string().optional().default(""),
  legalRepresentative: z.string().optional().default(""),
  socialLinks: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.enum(SOCIAL_TYPES_LIST),
        icon: z.string(),
      }),
    )
    .default([]),
});

export const sellerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  socialMedia1: socialMediaSchema,
  socialMedia2: socialMediaSchema,
  socialMedia3: socialMediaSchema,
  isActive: z.boolean().default(true),
});

const IconUpdateSchema = z.object({
  name: z.string(),
  url: z.union([z.string(), z.instanceof(File)]),
});

const iconSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const sellersSettingsUpdateSchema = z.object({
  socialIcons: z.object({
    icon1: IconUpdateSchema,
    icon2: IconUpdateSchema,
    icon3: IconUpdateSchema,
  }),
  list: z.array(sellerSchema).default([]),
});

export const sellersSettingsSchema = z.object({
  socialIcons: z.object({
    icon1: iconSchema,
    icon2: iconSchema,
    icon3: iconSchema,
  }),
  list: z.array(sellerSchema),
});

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
      facebook: socialMediaSchema,
      zalo: socialMediaSchema,
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

const benefitBaseSchema = {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  details: z.string().optional(),
};

const positionSchema = z.object({
  anchor: z.enum(ANCHOR_LIST),
  xValue: z.string(),
  yValue: z.string(),
});

const contentBlockSchema = z.object({
  isActive: z.boolean(),
  value: z.string(),
  size: z.coerce.number(),
  color: z.string(),
  position: positionSchema,
});

const callToActionSchema = contentBlockSchema.extend({
  url: z.string(),
  bgColor: z.string().default(""),
});

export const responsiveSchema = z.object({
  image: z.object({
    url: z.string(),
    width: z.string(),
    ratio: z.string(),
  }),
  mainTitle: contentBlockSchema,
  subTitle: contentBlockSchema,
  callToAction: callToActionSchema,
});

export const responsiveUpdateSchema = z.object({
  image: z.object({
    url: z.union([z.string(), z.instanceof(File)]),
    width: z.string(),
    ratio: z.string(),
  }),
  mainTitle: contentBlockSchema,
  subTitle: contentBlockSchema,
  callToAction: callToActionSchema,
});

export const bannersSettingsUpdateSchema = z.object({
  benefits: z.object({
    isActive: z.boolean(),
    items: z.array(
      z.object({
        ...benefitBaseSchema,
        icon: z.union([z.string().default(""), z.instanceof(File)]),
      }),
    ),
  }),
  homeHero: z
    .object({
      isActive: z.boolean(),
      mobile: responsiveUpdateSchema,
      tablet: responsiveUpdateSchema,
      desktop: responsiveUpdateSchema,
    })
    .optional(),
});

export const bannersSettingsSchema = z.object({
  benefits: z.object({
    isActive: z.boolean(),
    items: z.array(
      z.object({
        ...benefitBaseSchema,
        icon: z.string(),
      }),
    ),
  }),
  homeHero: z
    .object({
      isActive: z.boolean(),
      mobile: responsiveSchema,
      tablet: responsiveSchema,
      desktop: responsiveSchema,
    })
    .optional(),
});

export const settingsTypeSchema = z.object({
  site: siteSettingsTypeSchema.optional(),
  sellers: sellersSettingsSchema.optional(),
  stores: storesSettingsUpdateSchema.default([]),
  banners: bannersSettingsSchema.optional(),
});
