import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { routing } from './routing'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes — JWT auth, bypass intl
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      const token = request.cookies.get(COOKIE_NAME)?.value
      if (token) {
        try {
          await verifyToken(token)
          return NextResponse.redirect(new URL('/admin/cars', request.url))
        } catch { /* invalid token */ }
      }
      return NextResponse.next()
    }
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url))
    try {
      await verifyToken(token)
      return NextResponse.next()
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', request.url))
      res.cookies.delete(COOKIE_NAME)
      return res
    }
  }

  // Public routes — next-intl locale routing
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
