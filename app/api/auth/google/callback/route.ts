import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { loginWithGoogle } from "@/features/auth/auth.auth";
import { BASE_URL } from "@/constants";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get("oauth_state")?.value;

  // ✅ Kiểm tra CSRF: state không khớp thì từ chối
  if (!state || state !== stateCookie) {
    return NextResponse.json(
      { error: "Invalid or missing state" },
      { status: 403 },
    );
  }

  cookieStore.delete("oauth_state");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: "http://localhost:3000/api/auth/google/callback",
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const user = await userRes.json();
  console.log("Google user:", user);

  if (user.email && user.name && user.id) {
    const result = await loginWithGoogle({
      email: user.email,
      name: user.name,
      providerId: user.id,
    });

    if (result.success) {
      return NextResponse.redirect(new URL("/", BASE_URL));
    }

    return NextResponse.json({
      success: false,
      message: result.message,
    });
  }

  return NextResponse.json({
    success: false,
    message: "Something went wrong",
  });
}
