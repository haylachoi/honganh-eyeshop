import { JOB_SECRET } from "@/constants";
import dashboardRepository from "@/lib/db/repositories/dashboard";
import { NextRequest, NextResponse } from "next/server";

const secret = JOB_SECRET;

const jobNameList = ["daily", "monthly", "last7Days"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.secret || body.secret !== secret) {
      throw new Error("Invalid secret");
    }

    if (!jobNameList.includes(body.jobName)) {
      return NextResponse.json(
        { success: false, message: "Invalid jobName" },
        { status: 400 },
      );
    }

    if (body.jobName === "daily") {
      await dashboardRepository.updateDailyDashboard(new Date());
      await dashboardRepository.updateMonthlyDashboardByDaily({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    }
    if (body.jobName === "monthly") {
      await dashboardRepository.updateMonthlyDashboard({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    }

    if (body.jobName === "last7Days") {
      const today = new Date();

      const promises = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i)); // Tính từ 6 ngày trước đến hôm nay
        return dashboardRepository.updateDailyDashboard(date);
      });

      await Promise.all(promises);
    }

    return NextResponse.json({
      success: true,
      message: "Dashboard updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { sussess: false, message: "Error updating dashboard" },
      { status: 500 },
    );
  }
}
