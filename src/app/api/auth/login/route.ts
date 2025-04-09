import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json(
        { error: "Та нууц үг болон имайлээ дахин шалгана уу!." },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: "Нууц үг олдсонгүй." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return NextResponse.json(
        { error: "Та нууц үг болон имайлээ дахин шалгана уу!." },
        { status: 401 }
      );
    }

    // Generate tokens
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const refreshToken = jwt.sign(
      { userData },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    const accessToken = jwt.sign(
      { userData },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    // Create response
    const response = NextResponse.json({
      message: "Хэрэглэгч амжилттай нэвтэрлээ.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      status: 200,
    });

    // Set cookies properly
    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

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
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};