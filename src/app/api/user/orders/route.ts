import { getUserFromToken } from "@/lib/auth/getUser";
import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

// Define the Order type to match the Prisma schema
type Order = {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
  items: string[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    email: string;
  };
};

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
    // First, get orders directly associated with the user ID
    const userOrders = await prisma.order.findMany({
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

    // Find guest users that might have been created while the user was not logged in
    // Guest emails often contain patterns like guest_timestamp@example.com
    const guestUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: "guest_"
        },
        role: "customer",
        // You can add more conditions here to narrow down potential guest users
      }
    });

    // If we have guest users, get their orders
    let guestOrders: Order[] = [];
    if (guestUsers.length > 0) {
      const guestUserIds = guestUsers.map(guestUser => guestUser.id);
      
      guestOrders = await prisma.order.findMany({
        where: {
          userId: {
            in: guestUserIds
          }
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
    }

    // Check localStorage for the lastOrderDetails when available
    // This is a client-side concern, handled in the frontend component

    // Combine all orders and sort by date (most recent first)
    const allOrders = [...userOrders, ...guestOrders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ orders: allOrders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
