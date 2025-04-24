import { auth } from "@/features/auth/auth.auth";
import reviewRepository from "@/lib/db/repositories/reviews";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  productId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = inputSchema.parse(body);
    const user = await auth();

    if (!user) {
      return NextResponse.json({ review: null, canReview: false });
    }

    const [review, canReview] = await Promise.all([
      reviewRepository.getReviewByProductIdAndUserId({
        productId: productId,
        userId: user.id,
      }),
      reviewRepository.canUserReview({
        productId: productId,
        userId: user.id,
      }),
    ]);

    return NextResponse.json({ review, canReview });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong", details: err },
      { status: 500 },
    );
  }
}
