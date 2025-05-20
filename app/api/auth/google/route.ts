import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = encodeURIComponent(
    "http://localhost:3000/api/auth/google/callback",
  );
  const scope = encodeURIComponent("openid profile email");

  const state = crypto.randomUUID(); // ✅ Tạo chuỗi ngẫu nhiên chống CSRF
  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5, // 5 phút
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;

  return NextResponse.redirect(url);
}
