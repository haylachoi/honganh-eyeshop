import { OrderDbInputType, OrderType } from "@/features/orders/order.types";
import Order from "../model/order.model";
import { connectToDatabase } from "..";
import { unstable_cache } from "next/cache";
import { CACHE, ERROR_MESSAGES, REVIEW_ELIGIBILITY_PERIOD } from "@/constants";
import { orderTypeSchema } from "@/features/orders/order.validator";
import { NotFoundError } from "@/lib/error";
import { FilterQuery, ProjectionType } from "mongoose";
import { Id } from "@/types";

const getAllOrders = unstable_cache(
  async () => {
    await connectToDatabase();
    const orders = await Order.find({});
    const result = orders.map((order) => orderTypeSchema.parse(order));
    return result;
  },

  CACHE.ORDER.ALL.KEY_PARTS,
  {
    tags: [CACHE.ORDER.ALL.TAGS],
    revalidate: 3600,
  },
);

const getOrdersByUserId = async (userId: string) => {
  await connectToDatabase();
  const orders = await Order.find({ userId }).lean();
  const result = orders.map((order) => orderTypeSchema.parse(order));
  return result;
};

const getOrderByOrderId = async (orderId: string) => {
  await connectToDatabase();
  const order = await Order.findOne({ orderId }).lean();

  const result = order ? orderTypeSchema.parse(order) : null;
  return result;
};

const getOrdersByQuery = async ({
  query,
  projection,
}: {
  query: FilterQuery<OrderType>;
  projection?: ProjectionType<OrderType>;
}) => {
  await connectToDatabase();
  const orders = await Order.find(query, projection).lean();
  const result = orders.map((order) => orderTypeSchema.parse(order));
  return result;
};

const createOrder = async (input: OrderDbInputType) => {
  await connectToDatabase();
  console.log(input);
  const result = await Order.create(input);
  return result._id.toString();
};

const setOrderCompletedAt = async ({
  id,
  completedAt,
}: {
  id: string;
  completedAt: Date;
}) => {
  await connectToDatabase();

  const result = await Order.findOneAndUpdate(
    {
      _id: id,
      // orderStatus: "pending"
    },
    {
      $set: {
        orderStatus: "completed",
        completedAt: completedAt,
      },
    },
    { new: true },
  );

  if (!result) {
    throw new NotFoundError({
      resource: "order",
      message: ERROR_MESSAGES.ORDER.NOT_FOUND,
    });
  }

  return result._id.toString();
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
  pivotDate.setDate(pivotDate.getDate() - REVIEW_ELIGIBILITY_PERIOD);
  pivotDate.setHours(0, 0, 0, 0);
  const result = await Order.exists({
    userId,
    "items.productId": productId,
    completedAt: { $gte: pivotDate },
  });

  return !!result;
};

const ordersRepository = {
  getOrderByOrderId,
  getOrdersByUserId,
  getAllOrders,
  getOrdersByQuery,
  canUserReview,
  createOrder,
  setOrderCompletedAt,
};

export default ordersRepository;
