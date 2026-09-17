import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

const protectedRoutes = ['/admin', '/account', '/checkout']
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role?: string; adminRoleId?: string }
    
    if (isAdminRoute && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    if (decoded.role) requestHeaders.set('x-user-role', decoded.role)
    if (decoded.adminRoleId) requestHeaders.set('x-admin-role-id', decoded.adminRoleId)
    
    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('auth-token')
    return response
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
  ],
}