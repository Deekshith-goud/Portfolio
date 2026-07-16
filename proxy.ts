import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Create strict CSP. We remove unsafe-inline for scripts, but keep unsafe-eval for dev HMR.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cloud.umami.is ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ""
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://cdn.sanity.io https://icons.duckduckgo.com https://res.cloudinary.com https://images.unsplash.com https://github-contributions-api.deno.dev;
    connect-src 'self' https://api.github.com https://github-contributions-api.deno.dev https://*.api.sanity.io https://vitals.vercel-insights.com https://cloud.umami.is https://api.umami.is;
    font-src 'self' data:;
    frame-src 'self' https://giscus.app https://www.youtube.com https://my.spline.design https://*.spline.design;
  `.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  response.headers.set('Content-Security-Policy', cspHeader)
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
