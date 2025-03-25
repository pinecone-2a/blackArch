import { getUserFromToken } from "@/lib/auth/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const user = getUserFromToken(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}
