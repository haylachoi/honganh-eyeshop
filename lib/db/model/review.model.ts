import { ReviewTypeSchema } from "@/features/reviews/review.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof ReviewTypeSchema>;

export interface ReviewModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewModel>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ productId: 1 });
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });

const Review =
  (models.Review as Model<ReviewModel>) ||
  model<ReviewModel>("Review", reviewSchema);

export default Review;
