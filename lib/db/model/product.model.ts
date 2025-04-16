import { ProductTypeSchema } from "@/features/products/product.validator";
import mongoose, { Document, Model, model, models, Schema } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof ProductTypeSchema>;
export interface ProductModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductModel>(
  {
    name: {
      type: String,
      required: true,
    },
    nameNoAccent: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      name: { type: String, required: true },
      slug: { type: String, required: true },
    },
    attributes: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        valueSlug: {
          type: String,
        },
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
          name: { type: String, required: true },
        },
      ],
      default: [],
    },
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    variants: [
      {
        _id: false,
        uniqueId: { type: String, required: true },
        attributes: [
          {
            name: { type: String, required: true },
            value: { type: String, required: true },
            _id: false,
          },
        ],
        images: [String],
        countInStock: {
          type: Number,
          required: true,
        },
        originPrice: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
      default: 0,
    },
    rating: {
      1: {
        type: Number,
        default: 0,
      },
      2: {
        type: Number,
        default: 0,
      },
      3: {
        type: Number,
        default: 0,
      },
      4: {
        type: Number,
        default: 0,
      },
      5: {
        type: Number,
        default: 0,
      },
    },
    totalReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    totalSales: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: 1 });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ "category.slug": 1 });
// productSchema.index({ slug: 1, "category.slug": 1 }, { unique: true });
productSchema.index({ tags: 1 });
productSchema.index({ nameNoAccent: "text" }, { default_language: "none" });
productSchema.index({ isPublished: 1, isAvailable: 1 });
// todo: index for sorting

const Product =
  (models.Product as Model<ProductModel>) ||
  model<ProductModel>("Product", productSchema);

export default Product;
