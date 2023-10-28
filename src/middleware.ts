import { NextRequest, NextResponse } from "next/server"

const BASIC_AUTH_USERNAME = process.env["BASIC_AUTH_USERNAME"]!
const BASIC_AUTH_PASSWORD = process.env["BASIC_AUTH_PASSWORD"]!

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: ["/:path*", "/index/:path*"],
}

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  const basicAuth = req.headers.get("Authorization")

  if (basicAuth == null) {
    return NextResponse.json(
      { error: "Please enter credentials" },
      { headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' }, status: 401 },
    )
  }

  const authValue = basicAuth.split(" ")[1]
  const [user, password] = atob(authValue ?? "").split(":")

  if (user === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD) {
    return NextResponse.next()
  }

  return NextResponse.json(
    { error: "Invalid credentials" },
    { headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' }, status: 401 },
  )
}
