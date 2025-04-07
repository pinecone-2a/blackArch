import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database connection
    const dbCheck = {
      prismaConnected: true,
    };
    
    // Get counts of database entries
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    const productCount = await prisma.product.count();
    
    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
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
    
    return NextResponse.json({
      status: "OK",
      dbCheck,
      counts: {
        users: userCount,
        orders: orderCount,
        products: productCount
      },
      recentOrders
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 