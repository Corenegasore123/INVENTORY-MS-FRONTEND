import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  console.log("Middleware - Path:", pathname)
  console.log("Middleware - Token:", token ? "exists" : "missing")

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup"]

  // Check if the current path is a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route, redirect to login
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
    console.log("No token, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow all authenticated users to access any route for now
  // Role-based restrictions will be handled in the layout components
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
