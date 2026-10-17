import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "4s-hitech-pharma-auth";

const ADMIN_ROLES = new Set([
  "operations",
  "product_manager",
  "super_admin",
]);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isPharmacyAuthenticated = authCookie === "pharmacy";
  const isAdminAuthenticated =
    typeof authCookie === "string" && ADMIN_ROLES.has(authCookie);

  if (pathname.startsWith("/pharmacy") && !isPharmacyAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login") {
    if (isPharmacyAuthenticated) {
      return NextResponse.redirect(new URL("/pharmacy/dashboard", request.url));
    }

    if (isAdminAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/pharmacy/:path*",
    "/admin/:path*",
  ],
};