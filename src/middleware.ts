import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getAdminCookieName, isValidAdminSessionCookieValue } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect:
  // - /admin (dashboard)
  // - destructive admin APIs (DELETE requests)
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  // Protect write access to buildathon teams (GET is public for submit flow; writes are admin-only).
  const isBuildathonTeamsWriteApi =
    pathname.startsWith("/api/buildathon/teams") && request.method !== "GET";
  const isAdminDeleteApi =
    request.method === "DELETE" &&
    (pathname === "/api/teams" ||
      pathname === "/api/projects" ||
      pathname === "/api/milestones");

  // (Optional) protect registrations listing endpoint if you use it elsewhere
  const isAdminReadApi =
    pathname === "/api/buildathon/registrations" ||
    pathname === "/api/buildathon/registrations/";

  if (!isAdminPage && !isBuildathonTeamsWriteApi && !isAdminDeleteApi && !isAdminReadApi) {
    return NextResponse.next();
  }

  // Allow reaching the login page without a session.
  if (isAdminLoginPage) return NextResponse.next();

  // Check for valid admin session cookie
  const cookieName = getAdminCookieName();
  const sessionCookie = request.cookies.get(cookieName)?.value;
  const isValidSession = await isValidAdminSessionCookieValue(sessionCookie);

  if (!isValidSession) {
    // Redirect to login page for admin pages
    if (isAdminPage) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Return 401 for API routes
    return new NextResponse("Unauthorized", {
      status: 401,
    });
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
