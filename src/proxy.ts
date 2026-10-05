import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "4s-hitech-pharma-auth";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = authCookie === "pharmacy";

  if (pathname.startsWith("/pharmacy") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/pharmacy/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/pharmacy/:path*",
  ],
};
