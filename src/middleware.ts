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
    console.error("Token decode error:", error);
    return null;
  }
};


export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= decoded.exp - 30;
};


export async function middleware(request: NextRequest) {
 
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  

  const loginUrl = new URL("/login", request.url);
  

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(loginUrl);
  }


  if (accessToken && !isTokenExpired(accessToken)) {
    const decoded = decodeToken(accessToken);
   
    if (!decoded?.userData || decoded.userData.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // Token valid and user is admin, allow request
    return NextResponse.next();
  }
  
  // Access token expired or missing, but refresh token exists
  if (refreshToken) {
    try {
      // Attempt to refresh the access token
      const response = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
        method: 'GET',
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });
      
      // Check if the refresh was successful
      if (!response.ok) {
        console.error("Token refresh failed:", await response.text());
        return NextResponse.redirect(loginUrl);
      }
      
      const data = await response.json();
      
      if (!data.accessToken) {
        console.error("No access token returned from refresh endpoint");
        return NextResponse.redirect(loginUrl);
      }
      
      // Verify the new access token has admin role
      const decoded = decodeToken(data.accessToken);
      if (!decoded?.userData || decoded.userData.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      
      // Create response that allows the request to continue
      const nextResponse = NextResponse.next();
      
      // Since the middleware can't see cookies set by the API route immediately,
      // we need to set the cookie here as well
      nextResponse.cookies.set({
        name: "accessToken",
        value: data.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 15, // 15 minutes
        path: "/"
      });
      
      return nextResponse;
    } catch (error) {
      console.error("Token refresh error:", error);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // No refresh token, redirect to login
  return NextResponse.redirect(loginUrl);
}

/**
 * Specify which routes this middleware applies to
 */
export const config = {
  matcher: ['/admin/:path*'],
};