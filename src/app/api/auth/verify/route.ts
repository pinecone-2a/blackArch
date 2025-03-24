import { verifyToken } from "@/lib/auth/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    return NextResponse.json(
      { message: "Protected data", user: decoded },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
