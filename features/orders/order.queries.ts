import ordersRepository from "@/lib/db/repositories/orders";
import { safeQuery } from "@/lib/query";

export const getAllOrders = safeQuery.query(async () => {
  return await ordersRepository.getAllOrders();
});
