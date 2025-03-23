import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from './lib/auth/getUser';
import {jwtDecode} from 'jwt-decode';


export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.log("Invalid token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};


export function middleware(request: NextRequest) {
  let cookie = request.cookies.get("refreshToken");
  if (!cookie?.value || isTokenExpired(cookie?.value!))
    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ['/admin/:path*', ], 
};
