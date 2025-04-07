import { NextResponse } from "next/server";

/**
 * Logout endpoint - clears auth cookies
 */
export const POST = async () => {
  try {
    const response = NextResponse.json({ 
      message: "Logged out successfully",
      status: 200
    });

    // Clear authentication cookies
    response.cookies.set({
      name: "accessToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Immediately expire
      path: "/"
    });

    response.cookies.set({
      name: "refreshToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Immediately expire
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
};