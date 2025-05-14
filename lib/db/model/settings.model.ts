import { STORE_TYPES_LIST } from "@/features/settings/settings.constants";
import { settingsTypeSchema } from "@/features/settings/settings.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof settingsTypeSchema>;

export interface SettingModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
    },
    sellers: {
      type: [
        {
          name: { type: String, required: true },
          email: { type: String, required: true },
          phone: { type: String, required: true },
          facebook: { type: String, required: true },
          isActive: { type: Boolean, default: true },
        },
      ],
      required: true,
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
  },
  {
    timestamps: true,
  },
);

const Settings =
  (models.Settings as Model<SettingModel>) ||
  model<SettingModel>("Settings", settingSchema);

export default Settings;
