import next_cache from "@/cache";
import { getAuthQueryClient } from "@/lib/query";
import { startOfDay } from "date-fns";

const resource = "dashboard";

const viewQueryClient = getAuthQueryClient({
  resource,
  scope: "all",
});

export const getDashboardDailyStats = viewQueryClient.query(async () => {
  const date = new Date();
  const start = startOfDay(date);
  // with cache, use start of the day bebcause date include time
  const result = await next_cache.dashboard.daily(start);
  return result;
});

export const getLast7DaysDashboardStats = viewQueryClient.query(async () => {
  const date = new Date();
  const start = startOfDay(date);
  const result = await next_cache.dashboard.last7Days({ startOfDay: start });
  return result;
});
