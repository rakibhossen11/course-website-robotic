// middleware.js (Updated for Edge Runtime)
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const config = {
  matcher: '/dashboard/:path*', // Protect your dashboard routes
};

export async function middleware(request) {
  // 1. Get the token from cookies or Authorization header
  const token = request.cookies.get('session')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Verify the token using Firebase's public keys (Client-side method)
  try {
    // Fetch Google's public keys
    const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    const publicKeys = await response.json();
    
    // You would need a JWT library compatible with Edge Runtime here
    // For example, using 'jose'
    const { decodeJwt } = await import('jose');
    
    const decodedToken = await decodeJwt(token, {
      issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    
    // Token is valid, allow request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    // Redirect to login if token is invalid
    return NextResponse.redirect(new URL('/login', request.url));
  }
}