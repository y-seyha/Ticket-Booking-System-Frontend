import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

interface CustomJwtPayload {
  role?: "ADMIN" | "CASHIER" | "USER";
  sub?: string;
}

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!tokenCookie?.value) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let role: "ADMIN" | "CASHIER" | "USER" | undefined;
  try {
    const payload = decodeJwt<CustomJwtPayload>(tokenCookie.value);
    if (payload && payload.role) {
      role = payload.role.toUpperCase() as "ADMIN" | "CASHIER" | "USER";
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!role) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (role === "ADMIN") return NextResponse.next();
    return NextResponse.rewrite(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/cashier")) {
    if (role === "CASHIER") return NextResponse.next();
    return NextResponse.rewrite(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/admin",
    "/admin/:path*",
    "/cashier",
    "/cashier/:path*",
  ],
};
