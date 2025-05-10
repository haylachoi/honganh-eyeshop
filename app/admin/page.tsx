import {
  getDashboardDailyStats,
  getLast7DaysDashboardStats,
} from "@/features/dashboard/dashboard.queries";
import { DashboardView } from "./dashboard-view";

export const revalidate = 0;

const DashboardPage = async () => {
  const [last7DaysDashboardStatsResult, dashboardDailyResult] =
    await Promise.all([getLast7DaysDashboardStats(), getDashboardDailyStats()]);

  if (!last7DaysDashboardStatsResult.success || !dashboardDailyResult.success) {
    return <div>Error</div>;
  }

  const last7DaysDashboardStats = last7DaysDashboardStatsResult.data;
  const dashboardDaily = dashboardDailyResult.data;

  return (
    <div>
      <DashboardView
        last7DaysDashboardStats={last7DaysDashboardStats}
        dashboardDaily={dashboardDaily}
      />
    </div>
  );
};
export default DashboardPage;
