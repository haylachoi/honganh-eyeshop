import { getSession } from "@/features/session/session.core";
import { safeUserInfoSchema } from "@/features/auth/auth.validator";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionResult = await getSession();

  if (!sessionResult.success) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = safeUserInfoSchema.parse(sessionResult.data);
  return NextResponse.json({ user });
}
