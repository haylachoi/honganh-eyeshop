import { NextRequest, NextResponse } from "next/server";
import { getCartWithProductDetailBySession } from "@/features/cart/cart.queries";
import { AppError } from "@/lib/error";

export async function GET(req: NextRequest) {
  try {
    const result = await getCartWithProductDetailBySession();
    console.log(result);

    if (result.success) {
      const cart = result.data;
      return NextResponse.json({ success: true, cart });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } catch (error) {
    if (error instanceof AppError && error.type === "AuthenticationError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
