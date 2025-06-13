import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("admin_logged_in")?.value === "true";
  const { pathname } = request.nextUrl;

  // 로그인 안 했으면 /login으로 리디렉션 (단, /login에서는 리디렉션하지 않음)
  if (!isLoggedIn && pathname === "/") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // 로그인한 상태에서 /login 접근 시 홈으로 리디렉션
  if (isLoggedIn && pathname === "/login") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
