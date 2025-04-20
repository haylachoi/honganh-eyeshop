import { CategoryType } from "@/features/categories/category.types";
import { Model, model, models, Schema, Document } from "mongoose";

export interface CategoryModel extends Document, Omit<CategoryType, "id"> {
  createdAt: Date;
  updatedAt: Date;
}

const attributeSchema = new Schema(
  {
    name: { type: String, required: true },
    display: { type: String, required: true },
    defaultValue: { type: String, default: "" },
  },
  { _id: false },
);

const categorySchema = new Schema<CategoryModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, trim: true },
    attributes: [attributeSchema],
  },
  { timestamps: true },
);

// categorySchema.set("toJSON", { virtuals: true });

categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });

const Category =
  (models.Category as Model<CategoryModel>) ||
  model<CategoryModel>("Category", categorySchema);

export default Category;
