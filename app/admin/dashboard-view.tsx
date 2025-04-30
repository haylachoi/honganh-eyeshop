"use client";
import { DollarSign, Eye, Package, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DashboardDailyType,
  TopProductType,
} from "@/features/dashboard/dashboard.types";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import Image from "next/image";
import Link from "next/link";
import { TOP_PRODUCT_COUNT } from "@/features/dashboard/dashboard.constants";

export const DashboardView = ({
  dashboardDaily,
  last7DaysDashboardStats,
}: {
  dashboardDaily: DashboardDailyType;
  last7DaysDashboardStats: DashboardDailyType[];
}) => {
  const frendlyDashboardDaily = {
    ...dashboardDaily,
    date: new Date(dashboardDaily.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }),
  };

  const friendlyLast7DaysDashboardStats = last7DaysDashboardStats.map(
    (dashboardDaily) => {
      return {
        ...dashboardDaily,
        date: new Date(dashboardDaily.date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
      };
    },
  );

  const { topProducts } = frendlyDashboardDaily;

  return (
    <div className="space-y-8">
      {/* Tổng quan */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <SumaryCard title="Đơn hàng/ Doanh thu đã xác nhận hôm nay">
          <div className="flex gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Package />
              {dashboardDaily.totalConfirmedOrders}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign />
              {dashboardDaily.totalConfirmedRevenue}
            </div>
          </div>
        </SumaryCard>

        <SumaryCard title="Đơn hàng/ Doanh thu hoàn thành hôm nay">
          <div className="flex gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Package />
              {dashboardDaily.totalCompletedOrders}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign />
              {dashboardDaily.totalCompletedRevenue}
            </div>
          </div>
        </SumaryCard>

        <SumaryCard title="Người dùng mới/ Lượt xem trong hôm nay">
          <div className="flex gap-2 justify-between">
            <div className="flex items-center gap-2">
              <UserPlus />
              {dashboardDaily.totalNewUsers}
            </div>
            <div className="flex items-center gap-2">
              <Eye />
              {dashboardDaily.totalViews}
            </div>
          </div>
        </SumaryCard>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 xl:grid-cols-2  gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={friendlyLast7DaysDashboardStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalConfirmedRevenue"
                  fill="var(--color-chart-1)"
                  name="Đơn hàng đã xác nhận"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="totalCompletedRevenue"
                  fill="var(--color-chart-2)"
                  name="Đơn hàng hoàn thành"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng 7 ngày gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={friendlyLast7DaysDashboardStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalConfirmedOrders"
                  fill="var(--color-chart-1)"
                  radius={[4, 4, 0, 0]}
                  name="Đơn hàng đã xác nhận"
                />
                <Bar
                  dataKey="totalCompletedOrders"
                  fill="var(--color-chart-2)"
                  radius={[4, 4, 0, 0]}
                  name="Đơn hàng hoàn thành"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <TopProducts topProducts={topProducts} />
      </div>
    </div>
  );
};

const TopProducts = ({ topProducts }: { topProducts: TopProductType[] }) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        {`Top ${TOP_PRODUCT_COUNT} sản phẩm bán chạy trong ngày`}
      </h2>
      <div className="grid grid-cols-[minmax(200px,1fr)_100px] gap-4">
        <p className="font-semibold">Sản phẩm</p>
        <p className="text-right font-semibold">Đã bán</p>
        {topProducts.length === 0 && (
          <p className="col-span-2 text-center">Không có sản phẩm nào</p>
        )}
        {topProducts.map((product) => (
          <li
            key={product.productId.toString()}
            className="grid grid-cols-subgrid col-span-2 items-center"
          >
            <Link className="flex items-center gap-2" href={product.productUrl}>
              <Image
                src={product.imageUrl}
                alt={product.productName}
                width={25}
                height={50}
                className="w-20 aspect-[18/9] object-cover rounded"
              />
              <div className="font-medium">{product.productName}</div>
            </Link>
            <div className="text-right font-semibold">{product.sold}</div>
          </li>
        ))}
      </div>
    </Card>
  );
};

const SumaryCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{children}</CardContent>
    </Card>
  );
};
