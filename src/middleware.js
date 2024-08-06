import { NextResponse } from "next/server";
import verifyOnJWT from "./JWT/verifyOnEdge";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  const isPublicPath =
    path === "/login" || path === "/register" || path === "/forget-password";

  // Authenticate API calls
  if (
    !isPublicPath &&
    path.startsWith("/api/") &&
    !path.endsWith("login") &&
    !path.endsWith("register") &&
    !path.endsWith("forget-password")
  ) {
    const verifyData = await verifyOnJWT(token);
    const isAuth = verifyData?.payload;

    if (!isAuth) {
      const headers = {
        "Set-Cookie": `token=; HttpOnly=true; expires=${new Date(
          0
        ).toUTCString()}; path=/`,
      };
      // Respond with JSON indicating an error message
      return NextResponse.json(
        { success: false, message: "authentication failed" },
        { status: 401 }
      );
    }

    if (isAuth.role === "student" && path.startsWith("/api/admin")) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", isAuth.id);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return response;
  }

  if (!path.startsWith("/api/")) {
    if (isPublicPath && token) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isPublicPath && !token && token === "") {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
  // await middleware1(request)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forget-password",
    "/live_session",
    "/notes",
    "/gallary",
    "/admin/:path*",
    "/api/:path*",
  ],
};
