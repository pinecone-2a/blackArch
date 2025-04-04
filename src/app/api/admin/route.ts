import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

export async function GET() {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: { status: "completed" }
        });

        const totalOrders = await prisma.order.count({
            where: { status: "completed" }
        });

        const ordersByMonth = await prisma.order.groupBy({
            by: ["createdAt"],
            _count: { _all: true },
            where: { status: "completed" },
        });

        const lastOrders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        const users = await prisma.user.findMany({
            where: { role: "user" }
        });
        
        const userCount = users.length;
                


        return NextResponse.json({
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            totalOrders,
            ordersByMonth,
            lastOrders,
            userCount
        }, { status: 200
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
