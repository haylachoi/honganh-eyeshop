import { JOB_SECRET } from "@/constants";
import userRepository from "@/lib/db/repositories/user";
import { NextRequest, NextResponse } from "next/server";

const secret = JOB_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.secret || body.secret !== secret) {
      throw new Error("Invalid secret");
    }

    await userRepository.cleanUpUnverifiedAccount();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error cleaning up unverified accounts" },
      { status: 500 },
    );
  }
}
