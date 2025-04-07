import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    // Validate the order ID format
    const isValidId = orderId && /^[0-9a-fA-F]{24}$/.test(orderId);
    
    // Check if orderId is a valid ObjectId
    const validObjectId = ObjectId.isValid(orderId);
    
    // Attempt to find the order directly
    let order = null;
    let error = null;
    
    try {
      order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          user: {
            select: {
              username: true,
              email: true
            }
          }
        }
      });
    } catch (e) {
      error = e instanceof Error ? e.message : "Unknown error finding order";
    }
    
    // Check all orders to see if any match this ID
    const allOrders = await prisma.order.findMany({
      take: 10,
      select: {
        id: true,
        status: true,
        createdAt: true
      }
    });
    
    const orderExists = allOrders.some(o => o.id === orderId);
    
    return NextResponse.json({
      requestedId: orderId,
      diagnostics: {
        isValidIdFormat: isValidId,
        isValidObjectId: validObjectId,
        orderExists: orderExists,
        error: error
      },
      allOrderIds: allOrders.map(o => o.id),
      foundOrder: order
    });
  } catch (error) {
    console.error("Debug order endpoint error:", error);
    return NextResponse.json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      requestedId: params.id
    }, { status: 500 });
  }
} 