import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password|$).*)',
  ],
}

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth/.*', // Auth API routes
  '/_next/.*', // Next.js internal files
]

export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => {
    if (path.includes('.*')) {
      // Handle regex patterns
      const regex = new RegExp(`^${path.replace('.*', '.*')}$`)
      return regex.test(pathname)
    }
    return pathname === path
  })

  // If it's a public path, allow access without checking auth
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For protected paths, check authentication
  const token = request.cookies.get('session')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    // Redirect to login if no token and trying to access protected route
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify token with Firebase
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    )

    if (!response.ok) {
      throw new Error('Invalid token')
    }

    // Token is valid, allow request to proceed
    return NextResponse.next()
  } catch (error) {
    console.error('Token verification failed:', error)
    
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    
    return response
  }
}