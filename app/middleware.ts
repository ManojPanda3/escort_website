import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const path_to_skip = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/api/auth/signup',
  '/api/auth/resetPassword',
]

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Initialize supabase middleware client
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })

  // Check if path should be skipped
  if (path_to_skip.includes(pathname)) {
    return NextResponse.next();
  }

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Check if trying to access admin routes
  if (pathname.startsWith('/api/admin/')) {
    // If no user or not an admin, redirect to home
    if (!user?.user_metadata?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // For non-admin routes, check if user is authenticated
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}
