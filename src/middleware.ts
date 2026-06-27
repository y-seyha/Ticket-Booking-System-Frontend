import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Look for the access token inside incoming cookies
  const hasAccessToken = request.cookies.has("access_token");
  const { pathname } = request.nextUrl;

  //Route Protection Boundary for hardcoded or direct navigation to /profile
  if (pathname.startsWith("/profile") && !hasAccessToken) {
    const loginUrl = new URL("/auth/login", request.url);

    // Save target path so the login screen can redirect them back after authenticating
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Matcher config ensures this interceptor only triggers for profile views
export const config = {
  matcher: ["/profile/:path*"],
};
