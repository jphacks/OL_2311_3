import { NextRequest, NextResponse } from "next/server"

const BASIC_AUTH_USER = process.env["BASIC_AUTH_USER"]!
const BASIC_AUTH_PASSWORD = process.env["BASIC_AUTH_PASSWORD"]!

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
// export const config = {
//   matcher: ["/:path*", "/index/:path*"],
// }

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  const basicAuth = req.headers.get("Authorization")

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1]
    // atob is deprecated but Buffer.from is not available in Next.js edge.
    const [user, password] = atob(authValue ?? "").split(":")

    if (user === BASIC_AUTH_USER && password === BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' }, status: 401 },
    )
  } else {
    return NextResponse.json(
      { error: "Please enter credentials" },
      { headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' }, status: 401 },
    )
  }
}
