import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { normalizeUrl } from '@/lib/url-utils'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Handle double slash normalization for all routes
  const pathname = request.nextUrl.pathname
  if (pathname.includes('//') && !pathname.startsWith('/api/')) {
    const normalizedPath = normalizeUrl(pathname)
    if (normalizedPath !== pathname) {
      const url = request.nextUrl.clone()
      url.pathname = normalizedPath
      return NextResponse.redirect(url, 301)
    }
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://gist.github.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' https: data: blob: https://avatars.githubusercontent.com",
    "connect-src 'self' https://cdn.contentful.com https://api.contentful.com https://api.github.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Get client IP for rate limiting (unused for now but ready for implementation)
    // const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';

    // Implement rate limiting logic here
    // For now, just add headers
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', '99')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
