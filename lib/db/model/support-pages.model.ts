import { supportPageTypeSchema } from "@/features/support-pages/support-pages.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof supportPageTypeSchema>;

export interface SupportPagesModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const supportPagesSchema = new Schema<SupportPagesModel>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    showFooter: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

supportPagesSchema.index({ slug: 1 }, { unique: true });

const SupportPages =
  (models.SupportPages as Model<SupportPagesModel>) ||
  model<SupportPagesModel>("SupportPages", supportPagesSchema);

export default SupportPages;
