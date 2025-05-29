import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from './types/supabase'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/designer-instances',
  '/design',
  '/instances',
  '/get-credits',
  '/widget'
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // If user is not signed in and trying to access a protected route
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is signed in and trying to access login page
  if (session && req.nextUrl.pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/designer-instances', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}