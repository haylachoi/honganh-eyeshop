import { PAGE_SIZE, SORTING_OPTIONS } from "@/constants";
import { getAllOrders } from "@/features/orders/order.queries";
import { DEFAULT_SERVER_ERROR_MESSAGE } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";

const size = PAGE_SIZE.ORDER.ALL.MD;
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sortBy = searchParams.get(SORTING_OPTIONS.SORT_BY) || "createdAt";
  const orderBy =
    searchParams.get(SORTING_OPTIONS.ORDER_BY) || SORTING_OPTIONS.DESC;
  try {
    const result = await getAllOrders({
      page,
      size,
      sortBy,
      orderBy: orderBy === SORTING_OPTIONS.ASC ? 1 : -1,
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.error.message,
      });
    }

    return NextResponse.json({ success: true, data: result.data });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: DEFAULT_SERVER_ERROR_MESSAGE,
      },
      {
        status: 500,
      },
    );
  }
}
