import { NextResponse } from "next/server";
import { getCartWithProductDetailBySession } from "@/features/cart/cart.queries";
import { AppError } from "@/lib/error";

export async function GET() {
  try {
    const result = await getCartWithProductDetailBySession();

    if (result.success) {
      const cart = result.data;
      return NextResponse.json({ success: true, cart });
    }

    console.log(result);

    return NextResponse.json({ success: false, message: result.error.message });
  } catch (error) {
    console.log("error", error);
    if (error instanceof AppError && error.type === "AuthenticationError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
