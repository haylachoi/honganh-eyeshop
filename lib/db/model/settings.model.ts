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
