import { getSession } from "@/features/session/session.core";
import { NextResponse } from "next/server";
import { safeUserInfoFromSessionSchema } from "@/features/users/user.validator";
import { DEFAULT_SERVER_ERROR_MESSAGE } from "@/lib/error";

export async function GET() {
  try {
    const sessionResult = await getSession();
    if (!sessionResult.success) {
      return NextResponse.json({
        success: false,
        message: "Bạn chưa đăng nhập",
      });
    }
    const user = safeUserInfoFromSessionSchema.parse(sessionResult.data);
    return NextResponse.json({ user, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: DEFAULT_SERVER_ERROR_MESSAGE },
      { status: 500 },
    );
  }
}
