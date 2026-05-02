import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Add paths that require authentication
const protectedPaths = ['/history', '/dashboard'];
// Add paths that are for admins only
const adminPaths = ['/admin/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  
  // If no session and trying to access protected path, redirect to login
  if (!sessionCookie && (protectedPaths.some(p => pathname.startsWith(p)) || adminPaths.some(p => pathname.startsWith(p)))) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (sessionCookie) {
    try {
      const session = await decrypt(sessionCookie);
      
      // If user is already logged in and tries to access login/register, redirect to home
      if (pathname === '/login' || pathname === '/register') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Admin check
      if (adminPaths.some(p => pathname.startsWith(p)) && session.user.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Note: We don't check activeSessionId here because it requires a DB call.
      // Next.js Middleware runs on the edge and doesn't support Prisma easily without proxy.
      // Session validation should happen in Server Components or API routes.
      
    } catch (error) {
      // Invalid session, clear cookie and redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
