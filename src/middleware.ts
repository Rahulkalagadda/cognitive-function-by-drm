import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get cap_auth and cap_role cookies
  const token = request.cookies.get("cap_auth")?.value;
  const role = request.cookies.get("cap_role")?.value;


  // Paths requiring doctor authentication
  const doctorPaths = ["/dashboard", "/patients", "/assessments", "/reports", "/settings"];
  
  // Check if current path is one of the doctor paths or starts with them
  const isDoctorPath = doctorPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Patient dashboard/portal paths (not the patient-login page itself)
  const isPatientPath = pathname === "/patient" || pathname.startsWith("/patient/");

  if (isDoctorPath) {
    if (!token || role !== "doctor") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isPatientPath) {
    if (!token || role !== "patient") {
      const loginUrl = new URL("/patient-login", request.url);
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
