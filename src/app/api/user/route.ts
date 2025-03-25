import { getUserFromToken } from "@/lib/auth/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 } // Use 401 for unauthorized errors
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}
