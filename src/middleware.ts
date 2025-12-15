import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getAdminCookieName, isValidAdminSessionCookieValue } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect:
  // - /admin (dashboard)
  // - destructive admin APIs (DELETE requests)
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminDeleteApi =
    request.method === "DELETE" &&
    (pathname === "/api/teams" ||
      pathname === "/api/projects" ||
      pathname === "/api/milestones");

  // (Optional) protect registrations listing endpoint if you use it elsewhere
  const isAdminReadApi =
    pathname === "/api/buildathon/registrations" ||
    pathname === "/api/buildathon/registrations/";

  if (!isAdminPage && !isAdminDeleteApi && !isAdminReadApi) {
    return NextResponse.next();
  }

  // Allow reaching the login page without a session.
  if (isAdminLoginPage) return NextResponse.next();

  const cookieValue = request.cookies.get(getAdminCookieName())?.value;
  const ok = isValidAdminSessionCookieValue(cookieValue);
  if (!ok) {
    // For the admin page, redirect to a real login screen.
    if (isAdminPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // For APIs, return 401.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/teams",
    "/api/projects",
    "/api/milestones",
    "/api/buildathon/registrations",
  ],
};
