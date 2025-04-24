import { ReviewDbInputType, ReviewType } from "@/features/reviews/review.type";
import { connectToDatabase } from "..";
import Review from "../model/review.model";
import {
  ReviewTypeSchema,
  reviewWithFullInfoSchema,
} from "@/features/reviews/review.validator";
import Product from "../model/product.model";
import mongoose, { FilterQuery } from "mongoose";
import { NotFoundError, ServerError } from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants";
import { Id } from "@/types";
import Order from "../model/order.model";
import { REVIEW_CONSTANT } from "@/features/reviews/review.constants";

const getAllReviewsWithFullInfo = async () => {
  await connectToDatabase();

  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
        pipeline: [
          {
            $project: {
              _id: 1,
              slug: 1,
              name: 1,
              category: {
                slug: 1,
              },
            },
          },
        ],
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        rating: 1,
        isDeleted: 1,
        comment: 1,
        createdAt: 1,
        updatedAt: 1,
        productId: 1,
        product: 1,
        user: 1,
      },
    },
  ]);

  const result = reviewWithFullInfoSchema.array().parse(reviews);

  return result;
};

const getReviewsWithUserNameByProductId = async ({
  productId,
  includeDeleted = false,
}: {
  productId: Id;
  includeDeleted?: boolean;
}) => {
  await connectToDatabase();
  const query: FilterQuery<ReviewType> = {
    productId: new mongoose.Types.ObjectId(productId),
  };
  if (!includeDeleted) {
    query.isDeleted = false;
  }

  const reviews = await Review.aggregate([
    { $match: query },
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
  const comment = input.comment;
  const hasComment = comment !== undefined && comment.length > 0;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatePipeline = [
      {
        $set: {
          [`rating.${rating}`]: { $add: [`$rating.${rating}`, 1] },
          // Chỉ tăng totalReviews nếu có comment
          ...(hasComment && {
            totalReviews: { $add: ["$totalReviews", 1] },
          }),
        },
      },
      {
        $set: {
          avgRating: {
            $cond: {
              if: {
                $gt: [
                  {
                    $sum: [
                      "$rating.1",
                      "$rating.2",
                      "$rating.3",
                      "$rating.4",
                      "$rating.5",
                    ],
                  },
                  0,
                ],
              },
              then: {
                $divide: [
                  {
                    $sum: [
                      { $multiply: ["$rating.1", 1] },
                      { $multiply: ["$rating.2", 2] },
                      { $multiply: ["$rating.3", 3] },
                      { $multiply: ["$rating.4", 4] },
                      { $multiply: ["$rating.5", 5] },
                    ],
                  },
                  {
                    $sum: [
                      "$rating.1",
                      "$rating.2",
                      "$rating.3",
                      "$rating.4",
                      "$rating.5",
                    ],
                  },
                ],
              },
              else: 0,
            },
          },
        },
      },
    ];

    const productResult = await Product.findByIdAndUpdate(
      productId,
      updatePipeline,
      {
        new: true,
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

const restoreReview = async ({ reviewId }: { reviewId: Id }) => {
  await connectToDatabase();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Tìm review cần khôi phục
    const review = await Review.findById(reviewId).session(session);

    if (!review) {
      throw new Error("Review không tồn tại");
    }

    if (!review.isDeleted) {
      throw new Error("Review này không bị ẩn, không cần khôi phục");
    }

    const productId = review.productId;
    const ratingValue = review.rating;
    const hasComment = review.comment ? true : false;

    // Khôi phục review
    review.isDeleted = false;
    await review.save({ session });

    const updatePipeline = [
      {
        $addFields: {
          [`rating.${ratingValue}`]: { $add: [`$rating.${ratingValue}`, 1] },

          totalReviews: {
            $cond: [
              hasComment,
              { $add: ["$totalReviews", 1] },
              "$totalReviews",
            ],
          },
        },
      },
      {
        $addFields: {
          avgRating: {
            $let: {
              vars: {
                totalRatings: {
                  $sum: [
                    "$rating.1",
                    "$rating.2",
                    "$rating.3",
                    "$rating.4",
                    "$rating.5",
                  ],
                },
                weightedSum: {
                  $sum: [
                    { $multiply: ["$rating.1", 1] },
                    { $multiply: ["$rating.2", 2] },
                    { $multiply: ["$rating.3", 3] },
                    { $multiply: ["$rating.4", 4] },
                    { $multiply: ["$rating.5", 5] },
                  ],
                },
              },
              in: {
                $cond: [
                  { $gt: ["$$totalRatings", 0] },
                  { $divide: ["$$weightedSum", "$$totalRatings"] },
                  0,
                ],
              },
            },
          },
        },
      },
    ];

    const updatedProduct = await Product.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(String(productId)) },
      updatePipeline,
      { session },
    );

    if (!updatedProduct) {
      throw new Error("Không tìm thấy sản phẩm để cập nhật");
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Lỗi khi khôi phục review:", error);
    throw error;
  }
};

const hideReview = async ({ reviewId }: { reviewId: Id }) => {
  await connectToDatabase();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const review = await Review.findById(reviewId).session(session);

    if (!review) {
      throw new Error("Review không tồn tại");
    }

    if (review.isDeleted) {
      throw new Error("Review đã bị ẩn trước đó");
    }

    const productId = review.productId;
    const ratingValue = review.rating;
    const hasComment = review.comment ? true : false;

    await Review.findByIdAndUpdate(reviewId, { isDeleted: true }, { session });

    const updatePipeline = [
      {
        $addFields: {
          "rating.1": {
            $cond: [
              { $eq: [ratingValue, 1] },
              { $max: [0, { $subtract: ["$rating.1", 1] }] },
              "$rating.1",
            ],
          },
          "rating.2": {
            $cond: [
              { $eq: [ratingValue, 2] },
              { $max: [0, { $subtract: ["$rating.2", 1] }] },
              "$rating.2",
            ],
          },
          "rating.3": {
            $cond: [
              { $eq: [ratingValue, 3] },
              { $max: [0, { $subtract: ["$rating.3", 1] }] },
              "$rating.3",
            ],
          },
          "rating.4": {
            $cond: [
              { $eq: [ratingValue, 4] },
              { $max: [0, { $subtract: ["$rating.4", 1] }] },
              "$rating.4",
            ],
          },
          "rating.5": {
            $cond: [
              { $eq: [ratingValue, 5] },
              { $max: [0, { $subtract: ["$rating.5", 1] }] },
              "$rating.5",
            ],
          },

          totalReviews: {
            $cond: [
              hasComment,
              { $max: [0, { $subtract: ["$totalReviews", 1] }] },
              "$totalReviews",
            ],
          },
        },
      },
      {
        $addFields: {
          avgRating: {
            $let: {
              vars: {
                totalRatings: {
                  $sum: [
                    "$rating.1",
                    "$rating.2",
                    "$rating.3",
                    "$rating.4",
                    "$rating.5",
                  ],
                },
                weightedSum: {
                  $sum: [
                    { $multiply: ["$rating.1", 1] },
                    { $multiply: ["$rating.2", 2] },
                    { $multiply: ["$rating.3", 3] },
                    { $multiply: ["$rating.4", 4] },
                    { $multiply: ["$rating.5", 5] },
                  ],
                },
              },
              in: {
                $cond: [
                  { $gt: ["$$totalRatings", 0] },
                  { $divide: ["$$weightedSum", "$$totalRatings"] },
                  0,
                ],
              },
            },
          },
        },
      },
    ];

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatePipeline,
      { new: true, session },
    );

    if (!updatedProduct) {
      throw new Error("Không tìm thấy sản phẩm để cập nhật");
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Lỗi khi ẩn review:", error);
    throw new ServerError({
      resource: "review",
    });
  }
};

const deleteReview = async (ids: string | string[]) => {
  await connectToDatabase();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    const reviewsModel = await Review.find({ _id: { $in: idsArray } }).session(
      session,
    );

    if (reviewsModel.length !== idsArray.length) {
      throw new NotFoundError({
        resource: "review",
        message: ERROR_MESSAGES.REVIEW.NOT_FOUND,
      });
    }

    const productRatingMap = new Map<
      string,
      { ratingCounts: number[]; totalReviews: number }
    >();

    // Gộp các cập nhật theo từng sản phẩm
    for (const review of reviewsModel) {
      const productId = review.productId.toString();
      const rating = review.rating;
      const hasComment = !!review.comment;

      if (!productRatingMap.has(productId)) {
        productRatingMap.set(productId, {
          ratingCounts: [0, 0, 0, 0, 0],
          totalReviews: 0,
        });
      }

      const data = productRatingMap.get(productId)!;
      if (rating >= 1 && rating <= 5) {
        data.ratingCounts[rating - 1] += 1;
      }
      if (hasComment) {
        data.totalReviews += 1;
      }
    }

    // Cập nhật sản phẩm
    for (const [
      productId,
      { ratingCounts, totalReviews },
    ] of productRatingMap.entries()) {
      const updatePipeline = [
        {
          $addFields: {
            "rating.1": {
              $max: [0, { $subtract: ["$rating.1", ratingCounts[0]] }],
            },
            "rating.2": {
              $max: [0, { $subtract: ["$rating.2", ratingCounts[1]] }],
            },
            "rating.3": {
              $max: [0, { $subtract: ["$rating.3", ratingCounts[2]] }],
            },
            "rating.4": {
              $max: [0, { $subtract: ["$rating.4", ratingCounts[3]] }],
            },
            "rating.5": {
              $max: [0, { $subtract: ["$rating.5", ratingCounts[4]] }],
            },
            totalReviews: {
              $max: [0, { $subtract: ["$totalReviews", totalReviews] }],
            },
          },
        },
        {
          $addFields: {
            avgRating: {
              $let: {
                vars: {
                  totalRatings: {
                    $sum: [
                      "$rating.1",
                      "$rating.2",
                      "$rating.3",
                      "$rating.4",
                      "$rating.5",
                    ],
                  },
                  weightedSum: {
                    $sum: [
                      { $multiply: ["$rating.1", 1] },
                      { $multiply: ["$rating.2", 2] },
                      { $multiply: ["$rating.3", 3] },
                      { $multiply: ["$rating.4", 4] },
                      { $multiply: ["$rating.5", 5] },
                    ],
                  },
                },
                in: {
                  $cond: [
                    { $gt: ["$$totalRatings", 0] },
                    { $divide: ["$$weightedSum", "$$totalRatings"] },
                    0,
                  ],
                },
              },
            },
          },
        },
      ];

      await Product.findByIdAndUpdate(productId, updatePipeline, {
        session,
        new: true,
      });
    }

    await Review.deleteMany({ _id: { $in: idsArray } }).session(session);

    await session.commitTransaction();
    session.endSession();

    return ids;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Lỗi khi xoá review:", error);
    throw new ServerError({
      resource: "review",
    });
  }
};

const canUserReview = async ({
  userId,
  productId,
}: {
  userId: Id;
  productId: Id;
}) => {
  await connectToDatabase();
  const pivotDate = new Date();
  pivotDate.setDate(pivotDate.getDate() - REVIEW_CONSTANT.ELIGIBILITY_PERIOD);
  pivotDate.setHours(0, 0, 0, 0);
  const result = await Order.exists({
    userId,
    "items.productId": productId,
    completedAt: { $gte: pivotDate },
  });

  return !!result;
};

const reviewRepository = {
  getAllReviewsWithFullInfo,
  getReviewsByProductId,
  getReviewsWithUserNameByProductId,
  getReviewByProductIdAndUserId,
  createReview,
  hideReview,
  restoreReview,
  canUserReview,
  deleteReview,
};

export default reviewRepository;
