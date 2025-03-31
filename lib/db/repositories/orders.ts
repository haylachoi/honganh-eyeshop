import { OrderDbInputType } from "@/features/orders/order.types";
import Order from "../model/order.model";
import { connectToDatabase } from "..";
import { unstable_cache } from "next/cache";
import { CACHE } from "@/constants";
import { orderTypeSchema } from "@/features/orders/order.validator";

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

const createOrder = async (input: OrderDbInputType) => {
  await connectToDatabase();
  console.log(input);
  const result = await Order.create(input);
  return result._id.toString();
};

const ordersRepository = {
  getAllOrders,
  createOrder,
};

export default ordersRepository;
