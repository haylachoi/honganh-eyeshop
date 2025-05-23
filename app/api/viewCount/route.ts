import { VIEWS_COUNT_CONFIG } from "@/constants";
import dashboardRepository from "@/lib/db/repositories/dashboard";
import { NextResponse } from "next/server";

export type ViewCache = {
  count: number;
  lastUpdated: number;
};

const globalWithView = globalThis as typeof globalThis & {
  _viewCache?: ViewCache;
};

const viewCache = globalWithView._viewCache || {
  count: 0,
  lastUpdated: Date.now(),
};

globalWithView._viewCache = viewCache;

export async function POST() {
  try {
    viewCache.count += 1;
    const now = Date.now();

    const timeSinceLastUpdate = now - viewCache.lastUpdated;

    const shouldUpdate =
      viewCache.count >= VIEWS_COUNT_CONFIG.maxViewAccumulate ||
      timeSinceLastUpdate >= VIEWS_COUNT_CONFIG.dbFlushThreshold;

    if (shouldUpdate) {
      await dashboardRepository.addTotalViews({
        date: new Date(),
        totalViews: viewCache.count,
      });

      viewCache.count = 0;
      viewCache.lastUpdated = now;
    }
    return NextResponse.json({
      sussess: true,
      message: "View count updated successfully",
    });
  } catch (error) {
    console.error("Error calling API:", error);
    return NextResponse.json(
      { sussess: false, message: "Error updating view count" },
      { status: 500 },
    );
  }
}
