import { getSession } from "@/features/session/session.core";
import { NextResponse } from "next/server";
import { safeUserInfoFromSessionSchema } from "@/features/users/user.validator";

export async function GET() {
  const sessionResult = await getSession();

  if (!sessionResult.success) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const user = safeUserInfoFromSessionSchema.parse(sessionResult.data);
  return NextResponse.json({ user });
}
