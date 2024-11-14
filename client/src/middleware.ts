import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const publicRoutes = ["/", "/auth"];
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
