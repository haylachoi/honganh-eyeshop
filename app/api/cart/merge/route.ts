import { getCartItemByIdAndVariantId } from "@/features/cart/cart.queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const localCart = (await req.json()) as {
    productId: string;
    variantId: string;
    quantity: number;
  }[];

  console.log("input", localCart);

  const result = await getCartItemByIdAndVariantId(localCart);
  if (result.success) {
    return NextResponse.json({
      success: true,
      items: result.data,
    });
  }

  return NextResponse.json({
    success: false,
    message: result.error,
  });
}
