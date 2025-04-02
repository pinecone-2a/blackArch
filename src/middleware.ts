import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
  userData: {
    id: string;
    email: string;
    role: string;
  };
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
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

export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get("refreshToken");
  
  if (!cookie?.value || isTokenExpired(cookie?.value)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  const decoded = decodeToken(cookie.value);
  if (!decoded?.userData || decoded.userData.role !== 'admin') {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // Allow admin users to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};