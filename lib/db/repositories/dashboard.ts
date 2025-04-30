import { DashboardDaily, DashboardMonthly } from "../model/dashboard.model";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  formatDate,
  subDays,
} from "date-fns";
import Order from "../model/order.model";
import User from "../model/user.model";
import { connectToDatabase } from "..";
import { Role } from "@/features/authorization/authorization.constants";
import {
  dashboardDailySchema,
  dashboardMonthlySchema,
  orderQueryResultSchema,
} from "@/features/dashboard/dashboard.validator";
import {
  getOrderMatchPipelineStage,
  getTopProductsPipelineStage,
  getTotalViewsMatchPipelineStage,
  getUserMatchPipelineStage,
  orderGroupPipelineStage,
  topProductsGroupPipelineStage,
  topProductsProjectPipelineStage,
  topProductsSortPipelineStage,
  topProductsUnwindPipelineStage,
  totalViewsGroupPipelineStage,
  userGroupPipelineStage,
} from "@/features/dashboard/dashboard.queries-builder";
import { TOP_PRODUCT_COUNT } from "@/features/dashboard/dashboard.constants";

const getDashboardDefaultValues = ({
  date,
  month,
}: { date: Date; month?: never } | { date?: never; month: string }) => {
  const base = {
    totalCompletedRevenue: 0,
    totalConfirmedRevenue: 0,
    totalConfirmedOrders: 0,
    totalCompletedOrders: 0,
    totalNewUsers: 0,
    totalViews: 0,
    topProducts: [],
  };

  if (date) {
    return { date, ...base };
  }

  return { month, ...base };
};
const createOrGetDailyDashboard = async (date: Date) => {
  await connectToDatabase();
  date = startOfDay(date);
  let dashboard = await DashboardDaily.findOne({ date });

  if (!dashboard) {
    dashboard = await DashboardDaily.create(
      getDashboardDefaultValues({ date }),
    );
  }

  return dashboardDailySchema.parse(dashboard);
};

const createOrGetMonthlyDashboard = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  await connectToDatabase();

  const date = new Date(year, month - 1, 1); // Chú ý: month trong JS bắt đầu từ 0 (0 = tháng 1)
  const monthString = formatDate(date, "yyyy-MM");
  let dashboard = await DashboardMonthly.findOne({ month: monthString });

  if (!dashboard) {
    dashboard = await DashboardMonthly.create(
      getDashboardDefaultValues({ month: monthString }),
    );
  }

  return dashboardMonthlySchema.parse(dashboard);
};

const fetchOrderStats = async (from: Date, to: Date) => {
  const orderQueryResult = await Order.aggregate([
    getOrderMatchPipelineStage({ from, to }),
    orderGroupPipelineStage,
  ]);

  const parsedOrderQueryResult = orderQueryResultSchema
    .array()
    .parse(orderQueryResult);

  const result = parsedOrderQueryResult.reduce(
    (acc, order) => {
      acc[order._id] = {
        totalRevenue: order.totalRevenue,
        totalOrders: order.totalOrders,
      };
      return acc;
    },
    {
      pending: { totalRevenue: 0, totalOrders: 0 },
      confirmed: { totalRevenue: 0, totalOrders: 0 },
      completed: { totalRevenue: 0, totalOrders: 0 },
    },
  );

  return result;
};

const fetchNewUsers = async (from: Date, to: Date, role: Role = "customer") => {
  const [result] = await User.aggregate([
    getUserMatchPipelineStage({ from, to, role }),
    userGroupPipelineStage,
  ]);

  return result?.count || 0;
};

const fetchTotalViews = async (from: Date, to: Date) => {
  const [result] = await Order.aggregate([
    getTotalViewsMatchPipelineStage({ from, to }),
    totalViewsGroupPipelineStage,
  ]);

  return result?.totalViews || 0;
};

const fetchTopProducts = async (
  from: Date,
  to: Date,
  limit = TOP_PRODUCT_COUNT,
) => {
  const topProducts = await Order.aggregate([
    getTopProductsPipelineStage({ from, to }),
    topProductsUnwindPipelineStage,
    topProductsGroupPipelineStage,
    topProductsProjectPipelineStage,
    topProductsSortPipelineStage,
    { $limit: limit },
  ]);

  return topProducts;
};

export const updateDailyDashboard = async (date: Date | string) => {
  await connectToDatabase();
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  const start = startOfDay(parsedDate);
  const end = endOfDay(parsedDate);

  const [orderStats, totalNewUsers, topProducts] = await Promise.all([
    fetchOrderStats(start, end),
    fetchNewUsers(start, end),
    fetchTopProducts(start, end),
  ]);

  await DashboardDaily.updateOne(
    { date: start },
    {
      $set: {
        totalCompletedRevenue: orderStats.completed.totalRevenue,
        totalCompletedOrders: orderStats.completed.totalOrders,
        totalConfirmedRevenue: orderStats.confirmed.totalRevenue,
        totalConfirmedOrders: orderStats.confirmed.totalOrders,
        totalNewUsers,
        topProducts,
      },
    },
    { upsert: true },
  );
};

export const updateMonthlyDashboard = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  await connectToDatabase();
  const date = new Date(year, month - 1, 1); // Chú ý: month trong JS bắt đầu từ 0 (0 = tháng 1)
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const [orderStats, totalNewUsers, topProducts, totalViews] =
    await Promise.all([
      fetchOrderStats(start, end),
      fetchNewUsers(start, end),
      fetchTopProducts(start, end),
      fetchTotalViews(start, end),
    ]);

  await DashboardMonthly.updateOne(
    { month: formatDate(date, "yyyy-MM") },
    {
      $set: {
        totalCompletedRevenue: orderStats.completed.totalRevenue,
        totalCompletedOrders: orderStats.completed.totalOrders,
        totalConfirmedRevenue: orderStats.confirmed.totalRevenue,
        totalConfirmedOrders: orderStats.confirmed.totalOrders,
        totalViews,
        totalNewUsers,
        topProducts,
      },
    },
    { upsert: true },
  );
};

export const updateMonthlyDashboardByDaily = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  await connectToDatabase();

  try {
    const date = new Date(year, month - 1, 1);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const aggregationResult = await DashboardDaily.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalCompletedRevenue: { $sum: "$totalCompletedRevenue" },
          totalConfirmedRevenue: { $sum: "$totalConfirmedRevenue" },
          totalConfirmedOrders: { $sum: "$totalConfirmedOrders" },
          totalCompletedOrders: { $sum: "$totalCompletedOrders" },
          totalNewUsers: { $sum: "$totalNewUsers" },
          totalViews: { $sum: "$totalViews" },
        },
      },
    ]);

    const {
      totalCompletedRevenue,
      totalConfirmedRevenue,
      totalConfirmedOrders,
      totalCompletedOrders,
      totalNewUsers,
      totalViews,
    } = aggregationResult[0] || {
      totalCompletedRevenue: 0,
      totalConfirmedRevenue: 0,
      totalConfirmedOrders: 0,
      totalCompletedOrders: 0,
      totalNewUsers: 0,
    };

    const topProducts = await Order.aggregate([
      getTopProductsPipelineStage({
        from: start,
        to: end,
      }),
      topProductsUnwindPipelineStage,
      topProductsGroupPipelineStage,
      topProductsProjectPipelineStage,
      topProductsSortPipelineStage,
      { $limit: TOP_PRODUCT_COUNT },
    ]);

    await DashboardMonthly.updateOne(
      { month: formatDate(date, "yyyy-MM") },
      {
        $set: {
          totalCompletedRevenue,
          totalConfirmedRevenue,
          totalConfirmedOrders,
          totalCompletedOrders,
          totalViews,
          totalNewUsers,
          topProducts: topProducts,
        },
      },
      { upsert: true },
    );

    console.log(`Monthly dashboard for ${year}-${month} updated successfully`);
  } catch (error) {
    console.error("Error updating monthly dashboard:", error);
  }
};

const getLast7DaysDashboardStats = async ({
  startOfDay,
}: {
  startOfDay: Date;
}) => {
  const sevenDaysAgo = subDays(startOfDay, 6); // từ 6 ngày trước đến hôm nay (7 ngày)

  const data = await DashboardDaily.find({
    date: { $gte: sevenDaysAgo, $lte: startOfDay },
  })
    .sort({ date: 1 })
    .lean();

  return dashboardDailySchema.array().parse(data);
};

const addTotalViews = async ({
  date,
  totalViews,
}: {
  date: Date;
  totalViews: number;
}) => {
  date = startOfDay(date);
  await DashboardDaily.updateOne(
    { date },
    {
      $inc: {
        totalViews,
      },
    },
  );
};

const dashboardRepository = {
  addTotalViews,
  getLast7DaysDashboardStats,
  createOrGetDailyDashboard,
  updateDailyDashboard,
  createOrGetMonthlyDashboard,
  updateMonthlyDashboard,
  updateMonthlyDashboardByDaily,
};

export default dashboardRepository;
