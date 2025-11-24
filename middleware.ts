import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/chat', '/history', '/seat-selection', '/movies/'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userCookie = request.cookies.get('user');

  // Parse user data dari cookie
  let user = null;
  try {
    if (userCookie?.value) {
      user = JSON.parse(userCookie.value);
    }
  } catch (error) {
    console.error('Error parsing user cookie:', error);
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};