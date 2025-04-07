import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

export async function GET() {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: { status: "delivered" }
        });

        const totalOrders = await prisma.order.count({
            where: { status: "delivered" }
        });

        const ordersByMonth = await prisma.order.groupBy({
            by: ["createdAt"],
            _count: { _all: true },
            where: { status: "delivered" },
        });

        // Also get the total revenue and orders regardless of status
        const allOrdersRevenue = await prisma.order.aggregate({
            _sum: { totalPrice: true }
        });

        const allOrdersCount = await prisma.order.count();

        const lastOrders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        const users = await prisma.user.findMany({
            where: { role: "customer" }
        });
        
        const userCount = users.length;
        
        // Transform orders to ensure they have all required fields for the UI
        const formattedOrders = lastOrders.map(order => ({
            id: order.id,
            customer: order.user?.username || "Guest User",
            address: order.shippingAddress ? JSON.stringify(order.shippingAddress) : "",
            amount: order.totalPrice || 0,
            date: order.createdAt ? order.createdAt.toISOString() : null,
            product: Array.isArray(order.items) ? `${order.items.length} items` : "Unknown",
            status: order.status || "pending"
        }));
                
        return NextResponse.json({
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            totalOrders,
            totalPendingRevenue: allOrdersRevenue._sum.totalPrice || 0,
            totalPendingOrders: allOrdersCount,
            ordersByMonth,
            lastOrders: formattedOrders,
            userCount
        }, { status: 200
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
