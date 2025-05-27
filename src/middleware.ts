import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const userRoles = request.cookies.get("userRoles")?.value
  const { pathname } = request.nextUrl

  console.log("Middleware - Path:", pathname)
  console.log("Middleware - Token:", token ? "exists" : "missing")
  console.log("Middleware - Roles:", userRoles)

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

  // If token exists, check role-based access
  if (token && userRoles) {
    try {
      const roles = JSON.parse(userRoles)
      const isAdmin = roles.includes("ADMIN")

      // Admin trying to access user routes - redirect to admin
      if (isAdmin && pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard")) {
        console.log("Admin accessing user route, redirecting to admin")
        return NextResponse.redirect(new URL("/admin", request.url))
      }

      // Non-admin trying to access admin routes - redirect to dashboard
      if (!isAdmin && pathname.startsWith("/admin")) {
        console.log("Non-admin accessing admin route, redirecting to dashboard")
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      console.error("Error parsing roles:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
