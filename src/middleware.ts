import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get cap_auth and cap_role cookies
  const token = request.cookies.get("cap_auth")?.value;
  const role = request.cookies.get("cap_role")?.value;

  console.log(`[Middleware Check] Path: ${pathname} | Token: ${token} | Role: ${role}`);

  // Paths requiring doctor authentication
  const doctorPaths = ["/dashboard", "/patients", "/assessments", "/reports", "/settings"];
  
  // Check if current path is one of the doctor paths or starts with them
  const isDoctorPath = doctorPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Patient paths (excluding public assessment routes)
  const isPatientPath = pathname === "/patient" || pathname.startsWith("/patient/");

  if (isDoctorPath) {
    if (!token || role !== "doctor") {
      console.log(`[Middleware Redirect] Doctor unauthorized for path ${pathname}. Redirecting to /login`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isPatientPath) {
    if (!token || role !== "patient") {
      console.log(`[Middleware Redirect] Patient unauthorized for path ${pathname}. Redirecting to /login`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patients/:path*",
    "/assessments/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/patient/:path*",
  ],
};
