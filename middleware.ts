import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./features/session/session.core";

const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();
  // toto: update session exp

  return response;
}

async function middlewareAuth(request: NextRequest) {
  if (adminRoutes.includes(request.nextUrl.pathname)) {
    const result = await getSession();
    if (!result.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (result.data.role !== "admin") {
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
