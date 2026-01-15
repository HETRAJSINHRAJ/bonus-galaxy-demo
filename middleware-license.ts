/**
 * Middleware to check license status
 * Add this to your middleware.ts file
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This would be your license verification endpoint
const LICENSE_CHECK_URL = process.env.LICENSE_SERVER_URL;
const LICENSE_KEY = process.env.LICENSE_KEY;

let lastCheck = 0;
let isLicenseValid = true;
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // Check every 24 hours

async function checkLicense() {
  const now = Date.now();
  
  // Only check once per day
  if (now - lastCheck < CHECK_INTERVAL) {
    return isLicenseValid;
  }

  try {
    if (!LICENSE_KEY || !LICENSE_CHECK_URL) {
      // If not configured, allow (for development)
      return true;
    }

    const response = await fetch(LICENSE_CHECK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licenseKey: LICENSE_KEY,
        domain: process.env.NEXT_PUBLIC_APP_URL,
      }),
    });

    const data = await response.json();
    isLicenseValid = data.valid === true;
    lastCheck = now;
    
    return isLicenseValid;
  } catch (error) {
    console.error('License check failed:', error);
    // On error, keep previous status
    return isLicenseValid;
  }
}

export async function middleware(request: NextRequest) {
  // Skip license check for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/health') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const valid = await checkLicense();

  if (!valid) {
    // Redirect to license expired page
    return NextResponse.redirect(new URL('/license-expired', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
