import { ReviewDbInputType } from "@/features/reviews/review.type";
import { connectToDatabase } from "..";
import Review from "../model/review.model";
import { ReviewTypeSchema } from "@/features/reviews/review.validator";
import Product from "../model/product.model";
import mongoose from "mongoose";
import { NotFoundError } from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants";
import { Id } from "@/types";

const getReviewsWithUserNameByProductId = async ({
  productId,
}: {
  productId: Id;
}) => {
  await connectToDatabase();
  const reviews = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        userId: 1,
        productId: 1,
        rating: 1,
        comment: 1,
        name: "$user.name",
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  const result = reviews.map((review) => ReviewTypeSchema.parse(review));
  return result;
};

const getReviewsByProductId = async ({ productId }: { productId: Id }) => {
  await connectToDatabase();
  const reviews = await Review.find({ productId }).lean();
  const result = reviews.map((review) => ReviewTypeSchema.parse(review));
  return result;
};

const getReviewByProductIdAndUserId = async ({
  productId,
  userId,
}: {
  productId: Id;
  userId: Id;
}) => {
  await connectToDatabase();
  const review = await Review.findOne({
    productId,
    userId,
  }).lean();

  const result = review ? ReviewTypeSchema.parse(review) : null;

  return result;
};

const createReview = async (input: ReviewDbInputType) => {
  await connectToDatabase();
  const productId = input.productId;
  const rating = input.rating;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productResult = await Product.updateOne(
      { _id: productId },
      [
        {
          $set: {
            totalReviews: { $add: ["$totalReviews", 1] },
            avgRating: {
              $divide: [
                {
                  $add: [
                    { $multiply: ["$totalReviews", "$avgRating"] },
                    rating,
                  ],
                },
                { $add: ["$totalReviews", 1] },
              ],
            },
          },
        },
      ],

      {
        session,
      },
    );

    if (!productResult) {
      throw new NotFoundError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
      });
    }

    const review = new Review(input);
    await review.save({ session });

    const result = ReviewTypeSchema.parse(review);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const reviewRepository = {
  getReviewsByProductId,
  getReviewsWithUserNameByProductId,
  getReviewByProductIdAndUserId,
  createReview,
};

export default reviewRepository;
