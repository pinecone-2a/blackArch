import { getUserFromToken } from "@/lib/auth/getUser";
import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = getUserFromToken(req);

  console.log("User from token:", user); // Debugging line
  if (!user) {
    console.error("No user token found or invalid token");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }



  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
