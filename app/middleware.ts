import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
const path_to_skip = [
    '/',
    '/auth/login',
    '/auth/signup', 
    '/api/auth/signup',
    '/api/auth/resetPassword',
    '/profile/[id]'
]

export async function middleware(request:NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    if (path_to_skip.includes(pathname)) {
      return NextResponse.next();
    }

    const supabase = createServerComponentClient({cookies})
    const {data:{session}} = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Clone the request headers and add session info
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', session.user.id)
    requestHeaders.set('x-user-email', session.user.email || '')
    requestHeaders.set('x-user-role', session.user.user_metadata?.role || '')
    
    // Create a new request with the modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Add session info to response headers for client access
    response.headers.set('x-user-id', session.user.id)
    response.headers.set('x-user-email', session.user.email || '')
    response.headers.set('x-user-role', session.user.user_metadata?.role || '')

    return response
}