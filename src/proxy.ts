import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  console.log('[proxy] incoming:', url.pathname);

  if (url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (url.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/sales', request.url));
  }

  if (url.pathname === '/') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
