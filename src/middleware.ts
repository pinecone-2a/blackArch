import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from './lib/auth/getUser';

export async function middleware(req: NextRequest) {
  const user = getUserFromToken(req);

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*', 
};