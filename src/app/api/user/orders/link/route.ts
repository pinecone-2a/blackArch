import { getUserFromToken } from "@/lib/auth/getUser";
import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = getUserFromToken(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { orderId } = body;
    
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }
    
    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    // Check if the order belongs to a guest user (contains "guest_" in email)
    if (!order.user || !order.user.email.includes("guest_")) {
      return NextResponse.json(
        { error: "Order is not associated with a guest account" },
        { status: 400 }
      );
    }
    
    // Update the order to be associated with the current user
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { userId: user.id },
    });
    
    return NextResponse.json({ 
      message: "Order linked successfully", 
      order: updatedOrder 
    }, { status: 200 });
  } catch (error) {
    console.error("Error linking order:", error);
    return NextResponse.json(
      { error: "Failed to link order" },
      { status: 500 }
    );
  }
} 