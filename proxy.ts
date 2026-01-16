import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sign-out(.*)',
  '/api/download',
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/verify',
  '/api/public-missions',
  '/api/vouchers/validate',
  '/api/vouchers/redeem',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Add CORS headers for voucher API endpoints when called from mission-cms
  const origin = request.headers.get('origin');
  const isVoucherAPI = request.nextUrl.pathname.startsWith('/api/vouchers/');
  
  // Allow mission-cms to access voucher APIs
  if (isVoucherAPI && origin) {
    const allowedOrigins = [
      'https://bonus-galaxy-cms.vercel.app',
      'http://localhost:3001', // For local development
    ];
    
    if (allowedOrigins.includes(origin)) {
      const response = NextResponse.next();
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers: response.headers });
      }
      
      return response;
    }
  }

  // If the route is not public, protect it
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
