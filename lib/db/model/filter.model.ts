import { filterTypeSchema } from "@/features/filter/filter.validator";
import { z } from "zod";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";

type DbModel = z.input<typeof filterTypeSchema>;

interface FilterModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const filterSchema = new Schema<FilterModel>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    categorySlug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    values: [
      {
        value: String,
        valueSlug: String,
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Filter =
  (models.Filter as Model<FilterModel>) ||
  model<FilterModel>("Filter", filterSchema);

export default Filter;
