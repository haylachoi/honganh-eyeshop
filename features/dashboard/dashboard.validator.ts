import { z } from "zod";

export const topProductSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  sold: z.number().int().nonnegative(),
  productUrl: z.string(),
  imageUrl: z.string(),
});

export const dashboardDailySchema = z.object({
  date: z.date(),
  totalCompletedRevenue: z.number().nonnegative(),
  totalConfirmedRevenue: z.number().nonnegative(),
  totalConfirmedOrders: z.number().int().nonnegative(),
  totalCompletedOrders: z.number().int().nonnegative(),
  totalNewUsers: z.number().int().nonnegative(),
  totalViews: z.number().int().nonnegative().default(0),
  topProducts: z.array(topProductSchema),
});

export const dashboardMonthlySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/), // yyyy-MM
  totalCompletedRevenue: z.number().nonnegative(),
  totalConfirmedRevenue: z.number().nonnegative(),
  totalConfirmedOrders: z.number().int().nonnegative(),
  totalCompletedOrders: z.number().int().nonnegative(),
  totalNewUsers: z.number().int().nonnegative(),
  totalViews: z.number().int().nonnegative().default(0),
  topProducts: z.array(topProductSchema),
});

export const orderQueryResultSchema = z.object({
  _id: z.enum(["completed", "confirmed", "pending"]),
  totalRevenue: z.number().nonnegative(),
  totalOrders: z.number().int().nonnegative(),
});
