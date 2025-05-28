import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { loginWithGoogle } from "@/features/auth/auth.auth";
import { GOOGLE_AUTH } from "@/constants";
import { getFullLink } from "@/lib/utils";
import { API_ENDPOINTS } from "@/constants/endpoints.constants";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
// url must be absolute link
const CALLBACK_URL = getFullLink(API_ENDPOINTS.auth.google.callback);
const REDIRECT_URL = getFullLink();

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
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_AUTH.clientId,
      client_secret: GOOGLE_AUTH.clientSecret,
      redirect_uri: CALLBACK_URL,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Get user info
  const googleRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await googleRes.json();
  if (data && data.error) {
    console.error("Google Error:", data);
  }

  if (data.email && data.name && data.id) {
    const result = await loginWithGoogle({
      email: data.email,
      name: data.name,
      providerId: data.id,
    });

    if (result.success) {
      return NextResponse.redirect(REDIRECT_URL);
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
