import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for token in cookies or authorization header
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1]
  const user = token ? await verifyToken(token) : null

  // 🚪 Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/register') {
    if (user) {
      return NextResponse.redirect(new URL(user.role === 'ADMIN' ? '/admin' : '/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // 🚫 Not logged in
  if (!user) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/checkout')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Protect Admin API Routes
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.next()
  }

  // 🔐 Admin redirect (ensure admins land on the admin panel)
  if (user.role === 'ADMIN' && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // 🔒 Protect admin routes (Frontend & API) from regular users
  if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && user.role !== 'ADMIN') {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/checkout/:path*', '/login', '/register', '/api/admin/:path*'],
}