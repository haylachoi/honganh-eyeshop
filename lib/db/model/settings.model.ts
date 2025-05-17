import {
  ANCHOR_LIST,
  SOCIAL_TYPES_LIST,
  STORE_TYPES_LIST,
} from "@/features/settings/settings.constants";
import { settingsTypeSchema } from "@/features/settings/settings.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof settingsTypeSchema>;

export interface SettingModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const positionSchema = new mongoose.Schema(
  {
    anchor: {
      type: String,
      enum: ANCHOR_LIST,
      required: true,
    },
    xValue: { type: String, required: true },
    yValue: { type: String, required: true },
  },
  { _id: false },
);

const contentBlockSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, required: true },
    value: { type: String, required: true },
    size: { type: Number, required: true },
    color: { type: String, required: true },
    position: { type: positionSchema, required: true },
  },
  { _id: false },
);

const callToActionSchema = new mongoose.Schema(
  {
    ...contentBlockSchema.obj,
    url: { type: String, required: true },
    bgColor: { type: String, required: true },
  },
  { _id: false },
);

const responsiveSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String },
    },
    mainTitle: { type: contentBlockSchema, required: true },
    subTitle: { type: contentBlockSchema, required: true },
    callToAction: { type: callToActionSchema, required: true },
  },
  { _id: false },
);

const benefitItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String },
    icon: { type: String, required: true }, // bản upload sử dụng file path
  },
  { _id: false },
);

const settingSchema = new Schema<SettingModel>(
  {
    site: {
      name: { type: String, required: true },
      logo: { type: String, required: true },
      slogan: { type: String, required: true },
      description: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      // copyright: { type: String, required: true },
      businessRegistrationNumber: { type: String },
      legalRepresentative: { type: String },
      socialLinks: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
          type: { type: String, enum: SOCIAL_TYPES_LIST, required: true },
          icon: { type: String },
        },
      ],
    },
    sellers: {
      socialIcons: {
        icon1: { name: String, url: String },
        icon2: { name: String, url: String },
        icon3: { name: String, url: String },
      },
      list: {
        type: [
          {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            socialMedia1: { type: String },
            socialMedia2: { type: String },
            socialMedia3: { type: String },
            isActive: { type: Boolean, required: true },
          },
        ],
        required: true,
      },
    },

    stores: {
      type: [
        {
          name: { type: String, required: true },
          description: { type: String, required: true },
          type: { type: String, enum: STORE_TYPES_LIST, required: true },
          addressInfo: {
            address: { type: String, required: true },
            district: { type: String, required: true },
            province: { type: String, required: true },
            postalCode: { type: String },
          },
          contactInfo: {
            phone: { type: String },
            email: { type: String },
            facebook: { type: String },
            zalo: { type: String },
          },
          location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            googleMapLink: { type: String },
          },

          openingHours: { type: String, required: true },
          isOpenNow: { type: Boolean },
        },
      ],
      required: true,
    },
    banners: {
      benefits: {
        isActive: { type: Boolean, required: true },
        items: [benefitItemSchema],
      },
      homeHero: {
        type: new mongoose.Schema(
          {
            isActive: { type: Boolean, required: true },
            mobile: responsiveSchema,
            tablet: responsiveSchema,
            desktop: responsiveSchema,
          },
          { _id: false },
        ),
        required: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Settings =
  (models.Settings as Model<SettingModel>) ||
  model<SettingModel>("Settings", settingSchema);

export default Settings;
