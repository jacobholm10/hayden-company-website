import { NextRequest, NextResponse } from "next/server";
import { isTokenValid } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!(await isTokenValid(token))) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    if (token) response.cookies.delete("admin_session");
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
