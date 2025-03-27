import { tagTypeSchema } from "@/features/tags/tag.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof tagTypeSchema>;

export interface TagModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const tagSchema = new Schema<TagModel>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

tagSchema.index({ name: 1 }, { unique: true });

const Tag =
  (models.Tag as Model<TagModel>) || model<TagModel>("Tag", tagSchema);

export default Tag;
