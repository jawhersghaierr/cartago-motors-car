import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const payload = await verifyToken(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  // Redirect logged-in admin away from login page
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/admin/voitures', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
