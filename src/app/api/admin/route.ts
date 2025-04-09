import { NextResponse } from "next/server";
import prisma from "@/lib/connect";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define interface for admin data structure
interface AdminDashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalPendingRevenue: number;
  totalPendingOrders: number;
  lastOrders: Array<{
    id: string;
    customer: string;
    address: string;
    amount: number;
    date: string | null;
    product: string;
    status: string;
  }>;
  userCount: number;
}

// Add caching to avoid multiple identical requests
const CACHE_DURATION = 60 * 1000; // 1 minute
let cachedData: AdminDashboardData | null = null;
let cachedTimestamp = 0;

export async function GET(request: NextRequest) {
    console.log("API route /api/admin called");
    
    // Check if we have recent cached data
    const now = Date.now();
    if (cachedData && now - cachedTimestamp < CACHE_DURATION) {
        console.log("Returning cached admin data");
        return NextResponse.json(cachedData, { status: 200 });
    }
    
    try {
        console.log("Connecting to database...");
        
        // Simplified approach - collect all data at once
        const [
            totalRevenue,
            totalOrders,
            allOrdersRevenue,
            allOrdersCount,
            lastOrders,
            userCount
        ] = await Promise.all([
            // Total revenue from delivered orders
            prisma.order.aggregate({
                _sum: { totalPrice: true },
                where: { status: "delivered" }
            }),
            
            // Count of delivered orders
            prisma.order.count({
                where: { status: "delivered" }
            }),
            
            // Revenue from all orders
            prisma.order.aggregate({
                _sum: { totalPrice: true }
            }),
            
            // Count of all orders
            prisma.order.count(),
            
            // Recent orders
            prisma.order.findMany({
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
            }),
            
            // Count of customers
            prisma.user.count({
                where: { role: "customer" }
            })
        ]);
        
        console.log("All database queries completed successfully");
        
        // Format order data
        const formattedOrders = lastOrders.map(order => {
            // Process shipping address
            let addressStr = "";
            if (order.shippingAddress) {
                try {
                    const addr = typeof order.shippingAddress === 'object' 
                        ? order.shippingAddress 
                        : JSON.parse(String(order.shippingAddress));
                    
                    addressStr = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`;
                } catch (e) {
                    addressStr = String(order.shippingAddress);
                }
            }
            
            return {
                id: order.id,
                customer: order.user?.username || "Guest User",
                address: addressStr,
                amount: order.totalPrice || 0,
                date: order.createdAt ? order.createdAt.toISOString() : null,
                product: Array.isArray(order.items) ? `${order.items.length} бүтээгдэхүүн` : "0 бүтээгдэхүүн",
                status: order.status || "pending"
            };
        });
        
        // Prepare response data
        const responseData: AdminDashboardData = {
            totalRevenue: totalRevenue._sum?.totalPrice || 0,
            totalOrders,
            totalPendingRevenue: allOrdersRevenue._sum?.totalPrice || 0,
            totalPendingOrders: allOrdersCount,
            lastOrders: formattedOrders,
            userCount
        };
        
        // Cache the data
        cachedData = responseData;
        cachedTimestamp = now;
        
        console.log("Admin data prepared successfully");
        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ 
            error: "Failed to fetch stats", 
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    } finally {
        try {
            await prisma.$disconnect();
        } catch (e) {
            console.error("Error disconnecting from database:", e);
        }
    }
}
