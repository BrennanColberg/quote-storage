import { NextRequest, NextResponse } from "next/server"
import isUserAuthenticated from "./lib/isUserAuthenticated"

export async function middleware(request: NextRequest) {
  // simple authentication: check for hardcoded cookie
  if (!isUserAuthenticated())
    return new NextResponse("Unauthorized", { status: 401 })

  // log API history
  if (request.method !== "GET" && request.url.includes("/api/")) {
    console.log(
      `${request.method} ${request.nextUrl}`,
      JSON.stringify(await request.json()),
    )
  }
}

export const config = {
  matcher: ["/api/:path*", "/edit/:path*"],
}
