import { NextResponse } from "next/server";
import prisma from "@/lib/connect";


export async function GET() {
    try {
  
        const usersWithOrders = await prisma.user.findMany({
            include: {
                orders: true,
            },
        });
          
    
        const formattedUsers = usersWithOrders.map(user => ({
            id: user.id,
            name: user.username || user.email.split('@')[0],
            email: user.email,
            role: user.role === "admin" ? "admin" : "user",
            lastActive: user.createdAt,
            status: determineUserStatus(user),
            orders: user.orders.length
        }));

        return NextResponse.json(formattedUsers, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}



function determineUserStatus(user: any): "active" | "inactive" | "blocked" {

    const daysSinceCreation = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
 
    if (user.orders.length > 0) {
        return "active";
    } else if (daysSinceCreation < 30) {
        return "inactive";
    } else {
        return "blocked";
    }
}
