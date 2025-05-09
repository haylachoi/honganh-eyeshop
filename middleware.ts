import { NextResponse, type NextRequest } from "next/server";
import { getSession, updateSession } from "./features/session/session.core";
import { ENDPOINTS } from "./constants/endpoints.constants";

const adminRoutes = ["/admin"];
const protectedRoutes = [
  ENDPOINTS.PROFILE.USER_INFO,
  ENDPOINTS.PROFILE.USER_PASSWORD,
  ENDPOINTS.PROFILE.USER_ADDRESS,
  ENDPOINTS.ORDER,
];

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();
  await updateSession();

  return response;
}

async function middlewareAuth(request: NextRequest) {
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    const result = await getSession();
    if (!result.success) {
      return NextResponse.redirect(new URL(ENDPOINTS.HOME, request.url));
    }
  }

  if (
    adminRoutes.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.includes("/admin")
  ) {
    const result = await getSession();
    if (!result.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // todo: bellow code just is tempt, need to change
    if (result.data.role !== "admin" && result.data.role !== "seller") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
