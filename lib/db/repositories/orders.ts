import {
  OrderDbInputType,
  OrderStatus,
  OrderType,
} from "@/features/orders/order.types";
import Order from "../model/order.model";
import { connectToDatabase } from "..";
import { ERROR_MESSAGES, PAGE_SIZE } from "@/constants";
import { orderTypeSchema } from "@/features/orders/order.validator";
import { NotFoundError } from "@/lib/error";
import mongoose, { FilterQuery, ProjectionType, UpdateQuery } from "mongoose";
import Cart from "../model/cart.model";
import Checkout from "../model/checkout.model";
import Product from "../model/product.model";
import { PAYMENT_STATUS_MAPS } from "@/features/orders/order.constants";
import { Id } from "@/types";

const getAllOrders = async ({
  skip = 0,
  limit = PAGE_SIZE.ORDER.HISTORY.SM,
  sortBy = "createdAt",
  orderBy = -1,
}: {
  skip?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 1 | -1;
}) => {
  await connectToDatabase();
  const orders = await Order.find()
    .sort({ [sortBy]: orderBy })
    .skip(skip)
    .limit(limit);
  const result = orders.map((order) => orderTypeSchema.parse(order));
  return result;
};

const getLast30DaysOrders = async () => {
  await connectToDatabase();

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30);
  start.setHours(0, 0, 0, 0);

  const orders = await Order.find({
    createdAt: {
      $gte: start,
    },
  }).sort({ createdAt: -1 });

  const result = orders.map((order) => orderTypeSchema.parse(order));
  return result;
};

const getOrdersByUserId = async ({
  userId,
  offset = 0,
  limit = PAGE_SIZE.ORDER.HISTORY.SM,
}: {
  userId: Id;
  offset?: number;
  limit?: number;
}) => {
  await connectToDatabase();

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const parsedOrders = orders.map((order) => orderTypeSchema.parse(order));

  return parsedOrders;
};

const countOrders = async () => {
  await connectToDatabase();
  const count = await Order.countDocuments();
  return count;
};

const countOrdersByUserId = async ({ userId }: { userId: Id }) => {
  await connectToDatabase();
  const count = await Order.countDocuments({ userId });
  return count;
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
    // update total sales
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

const updateStatusOrder = async ({
  id,
  status,
  reason,
  date,
}: {
  id: string | string[];
  reason?: string;
  status: OrderStatus;
  date?: Date;
}) => {
  await connectToDatabase();

  const ids = Array.isArray(id) ? id : [id];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updateQuery: UpdateQuery<OrderType> = {
      $set: {
        orderStatus: status,
        paymentStatus: PAYMENT_STATUS_MAPS.PENDING,
      },
    };

    if (reason === "") {
      if (!updateQuery.$unset) {
        updateQuery.$unset = {};
      }
      updateQuery.$unset.cancelReason = "";
    }
    if (reason && updateQuery.$set) {
      updateQuery.$set.cancelReason = reason;
    }
    if (date && updateQuery.$set) {
      updateQuery.$set.completedAt = date;
    }

    const result = await Order.updateMany({ _id: { $in: ids } }, updateQuery, {
      session,
    });

    if (result.matchedCount !== ids.length) {
      throw new NotFoundError({
        resource: "order",
        message: ERROR_MESSAGES.ORDER.NOT_FOUND,
      });
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("failed:", error);
    throw error;
  }
};

const ordersRepository = {
  getLast30DaysOrders,
  getOrderByOrderId,
  getOrdersByUserId,
  getAllOrders,
  getOrdersByQuery,
  createOrder,
  updateStatusOrder,
  countOrdersByUserId,
  countOrders,
};

export default ordersRepository;
