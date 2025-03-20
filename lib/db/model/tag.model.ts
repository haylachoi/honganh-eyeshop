import { TagType } from "@/features/tags/tag.type";
import { Model, model, models, Schema, Document } from "mongoose";

export interface TagModel extends Document, Omit<TagType, "id"> {
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
