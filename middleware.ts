import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export function middleware() {
  // simple authentication: check for hardcoded cookie
  if (cookies().get("API_KEY")?.value !== process.env.API_KEY)
    return new NextResponse("Unauthorized", { status: 401 })
}

export const config = {
  matcher: ["/api/:path*", "/edit/:path*"],
}
