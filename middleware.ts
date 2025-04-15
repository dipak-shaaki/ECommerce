import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request })

    // Redirect to login if not authenticated
    if (!token) {
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // Redirect to unauthorized page if not an admin
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // Protect checkout and orders routes
  if (pathname.startsWith("/checkout") || pathname.startsWith("/orders")) {
    const token = await getToken({ req: request })

    // Redirect to login if not authenticated
    if (!token) {
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*"],
}
