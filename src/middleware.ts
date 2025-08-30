import { NextRequest, NextResponse } from "next/server";

// Paths under /admin require a valid session cookie
const ADMIN_PATH_PREFIX = "/admin";
const SESSION_COOKIE = "admin_session";
const ROLLING_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

function parseSessionCookie(value: string | undefined) {
  if (!value) return null;
  try {
    const json = Buffer.from(value, "base64").toString("utf-8");
    const payload = JSON.parse(json);
    return payload && typeof payload.exp === "number" ? payload : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard admin routes (but allow the login page itself)
  const isAdminRoute = pathname.startsWith(ADMIN_PATH_PREFIX);
  const isLoginPage = pathname === "/admin/login";
  if (!isAdminRoute || isLoginPage) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = parseSessionCookie(cookie);

  if (!session) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  const now = Date.now();
  if (session.exp <= now) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname);
    url.searchParams.set("reason", "expired");
    return NextResponse.redirect(url);
  }

  // Rolling renewal on activity: extend exp on each admin request
  const newPayload = { ...session, iat: now, exp: now + ROLLING_WINDOW_MS };
  const newCookie = Buffer.from(JSON.stringify(newPayload)).toString("base64");

  const response = NextResponse.next();
  response.cookies.set({
    name: SESSION_COOKIE,
    value: newCookie,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: ROLLING_WINDOW_MS / 1000,
  });

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
