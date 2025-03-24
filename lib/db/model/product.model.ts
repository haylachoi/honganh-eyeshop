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
          default: "",
        },
      },
    ],
    // images: [String],
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
    tags: {
      type: [
        {
          _id: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
          name: { type: String, required: true },
        },
      ],
      default: [],
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
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    // ratingDistribution: [
    //   {
    //     rating: {
    //       type: Number,
    //       required: true,
    //     },
    //     count: {
    //       type: Number,
    //       required: true,
    //     },
    //   },
    // ],
    numSales: {
      type: Number,
      required: true,
      default: 0,
    },
    // reviews: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Review",
    //     default: [],
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ "category.slug": 1 });
// productSchema.index({ slug: 1, "category.slug": 1 }, { unique: true });
productSchema.index({ tags: 1 });

const Product =
  (models.Product as Model<ProductModel>) ||
  model<ProductModel>("Product", productSchema);

export default Product;
