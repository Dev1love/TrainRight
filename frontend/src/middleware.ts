import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TRAINER_PATHS = ['/dashboard/trainer', '/clients', '/training-plans'];
const CLIENT_PATHS = ['/dashboard/client', '/workouts', '/progress'];
const PUBLIC_PATHS = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;

  // Redirect root to login
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Public routes handling
  if (PUBLIC_PATHS.includes(path)) {
    if (token) {
      // If authenticated, redirect to appropriate dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes handling
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  if (userRole === 'trainer' && CLIENT_PATHS.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard/trainer', request.url));
  }

  if (userRole === 'client' && TRAINER_PATHS.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard/client', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 