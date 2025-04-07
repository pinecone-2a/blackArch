import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export async function GET(req: Request) {
  const refreshToken = req.headers.get('cookie')?.match(/refreshToken=([^;]+)/)?.[1];

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      userData: { id: string; email: string; role: string };
    };

    const accessToken = jwt.sign(
      { userData: decoded.userData }, // Keeps the same userData structure
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' } 
    );

    // Create response with the access token
    const response = NextResponse.json({ 
      accessToken,
      message: "Access token refreshed successfully" 
    });

    // Set the access token as a cookie
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
      path: "/"
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
  }
}
