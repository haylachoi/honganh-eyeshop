import { OrderDbInputType, OrderType } from "@/features/orders/order.types";
import Order from "../model/order.model";
import { connectToDatabase } from "..";
import { unstable_cache } from "next/cache";
import { CACHE, ERROR_MESSAGES, REVIEW_ELIGIBILITY_PERIOD } from "@/constants";
import { orderTypeSchema } from "@/features/orders/order.validator";
import { NotFoundError } from "@/lib/error";
import mongoose, { FilterQuery, ProjectionType } from "mongoose";
import { Id } from "@/types";
import Cart from "../model/cart.model";
import Checkout from "../model/checkout.model";
import Product from "../model/product.model";

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

const updateCartAfterOrder = async (input: OrderDbInputType) => {
  const { userId } = input;
  if (!userId) {
    return;
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new NotFoundError({
        resource: "cart",
        message: ERROR_MESSAGES.CART.NOT_FOUND,
      });
    }

    // 3. Tạo map item để dễ lookup
    const quantityMap = new Map<string, number>(); // key = productId|variantId
    for (const item of input.items) {
      const key = `${item.productId}|${item.variantId}`;
      quantityMap.set(key, item.quantity);
    }

    // 4. Cập nhật từng item trong giỏ hàng
    const updatedItems = cart.items
      .map((item) => {
        const key = `${String(item.productId)}|${item.variantId}`;

        if (quantityMap.has(key)) {
          const newQty = item.quantity - quantityMap.get(key)!;
          if (newQty <= 0) return null; // sẽ bị loại khỏi mảng
          return {
            ...item,
            quantity: newQty,
          };
        }
        return item;
      })
      .filter((item) => item !== null); // loại bỏ các item có quantity <= 0

    cart.items = updatedItems;
    await cart.save();
  } catch (error) {
    console.error(error);
  }
};

const updateCountInStockAfterOrder = async ({
  orderItems,
  session,
}: {
  orderItems: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
  session: mongoose.ClientSession;
}) => {
  try {
    const bulkOps = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId, "variants.uniqueId": item.variantId },
        update: {
          $inc: { "variants.$[elem].countInStock": -item.quantity },
        },
        arrayFilters: [{ "elem.uniqueId": item.variantId }],
      },
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps, { session });
    }
  } catch (error) {
    console.error("Error during stock update:", error);
    throw error;
  }
};

const createOrder = async ({
  input,
  checkoutId,
}: {
  input: OrderDbInputType;
  checkoutId: string;
}) => {
  await connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await updateCountInStockAfterOrder({ orderItems: input.items, session });

    const createdOrder = await Order.create([input], { session });

    await Checkout.updateOne(
      { _id: checkoutId },
      {
        $set: {
          isOrderd: true,
          orderId: input.orderId,
        },
      },
      { session },
    );

    await session.commitTransaction();

    if (input.userId) {
      updateCartAfterOrder(input);
    }

    return createdOrder[0]._id.toString();
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction failed:", error);
    throw error;
  } finally {
    session.endSession();
  }
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
