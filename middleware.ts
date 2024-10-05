import getSession from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

// Configuration for the middleware
// Specifies which routes the middleware should run on
export const config = {
  // ! means that the middleware will not run on the next/static, next/image, or favicon.ico routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
