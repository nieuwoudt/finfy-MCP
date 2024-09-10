import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname as string;
  return path === "/"
    ? NextResponse.redirect(new URL("/onboarding", request.url))
    : NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)", "/"],
};
