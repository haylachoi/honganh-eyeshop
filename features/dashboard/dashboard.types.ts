import { z } from "zod";
import {
  dashboardDailySchema,
  dashboardMonthlySchema,
  orderQueryResultSchema,
  topProductSchema,
} from "./dashboard.validator";

export type DashboardDailyType = z.infer<typeof dashboardDailySchema>;
export type DashboardMonthlyType = z.infer<typeof dashboardMonthlySchema>;

export type TopProductType = z.infer<typeof topProductSchema>;

export type OrderQueryResultType = z.infer<typeof orderQueryResultSchema>;
