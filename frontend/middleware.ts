import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isCmsRoute = request.nextUrl.pathname.startsWith('/cms');
  const isLoginRoute = request.nextUrl.pathname === '/cms/login';

  if (isCmsRoute && !isLoginRoute) {
    const token = request.cookies.get('cms_access_token') || request.cookies.get('cms_refresh_token');
    
    // Se não há nenhum token, redirecionar para o login do CMS
    if (!token) {
      const loginUrl = new URL('/cms/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers that might be missing
  const response = NextResponse.next();
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
