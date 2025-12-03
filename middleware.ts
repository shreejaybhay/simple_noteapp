import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/", "/login", "/register"];
  const privateRoutes = ["/notes", "/notes/new"];

  // Also protect dynamic note routes
  const isNotesDetail = pathname.startsWith("/notes/");

  // User is NOT logged in
  if (!token) {
    if (privateRoutes.includes(pathname) || isNotesDetail) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // User IS logged in
  if (token) {
    if (publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/notes", req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/login", "/register", "/notes/:path*"],
};
