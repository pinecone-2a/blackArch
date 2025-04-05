import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export async function GET(req: Request) {
  // Get cookie using headers API instead of cookies()
  const refreshToken = req.headers.get('cookie')?.match(/refreshToken=([^;]+)/)?.[1];

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      userData: { id: string; email: string; role: string };
    };

    const accessToken = jwt.sign(
      { userId: decoded.userData.id, email: decoded.userData.email, role: decoded.userData.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' } 
    );

    return NextResponse.json({ accessToken });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
  }
}
