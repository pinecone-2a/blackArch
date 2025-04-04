import { getUserFromToken } from "@/lib/auth/getUser";
import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

// Get user address
export async function GET(req: NextRequest) {
  const user = getUserFromToken(req);

  if (!user) {
    console.error("No user token found or invalid token");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("Fetching address for user:", user.userId);

  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      select: {
        address: true,
      },
    });

    return NextResponse.json({ address: userData?.address || null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user address:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

// Update user address
export async function PUT(req: NextRequest) {
  const user = getUserFromToken(req);

  if (!user) {
    console.error("No user token found or invalid token");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("Fetching address for user:", user.userId);

  try {
    const { street, city, state, zip } = await req.json();

    if (!street || !city || !state || !zip) {
      return NextResponse.json(
        { error: "All address fields are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.userId,
      },
      data: {
        address: {
          street,
          city,
          state,
          zip,
        },
      },
      select: {
        address: true,
      },
    });

    return NextResponse.json({ address: updatedUser.address }, { status: 200 });
  } catch (error) {
    console.error("Error updating user address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}