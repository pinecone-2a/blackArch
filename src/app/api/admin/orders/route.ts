import { NextResponse } from "next/server";
import prisma from "@/lib/connect";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface FormattedOrder {
    id: string;
    customer: string;
    email: string;
    phone: string;
    address: string;
    amount: number;
    date: Date | string | null;
    items: OrderItem[];
    status: string;
    paymentMethod: string;
    paymentStatus: string;
}

// Add caching to avoid multiple identical requests
const CACHE_DURATION = 60 * 1000; // 1 minute
let cachedOrders: FormattedOrder[] | null = null;
let cachedTimestamp = 0;

export async function GET(request: NextRequest) {
    console.log("Admin orders API called");
    
    // Check if we have recent cached data
    const now = Date.now();
    if (cachedOrders && now - cachedTimestamp < CACHE_DURATION) {
        console.log("Returning cached orders data");
        return NextResponse.json(cachedOrders, { status: 200 });
    }
    
    try {
        console.log("Fetching all orders from database...");
        
        // First try to fetch orders without including user relation
        // This avoids the Prisma error with null user fields
        const ordersData = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        console.log(`Found ${ordersData.length} orders`);
        
        // Format orders for frontend consumption
        const formattedOrders: FormattedOrder[] = await Promise.all(
            ordersData.map(async (order) => {
                // Process order items if present
                let orderItems: OrderItem[] = [];
                try {
                    if (order.items) {
                        // Handle different formats of order.items
                        let productIds: string[] = [];
                        
                        if (typeof order.items === 'string') {
                            // Try to parse it as JSON string
                            try {
                                const parsed = JSON.parse(order.items);
                                if (Array.isArray(parsed)) {
                                    productIds = parsed.filter(id => typeof id === 'string');
                                } else if (parsed && typeof parsed === 'object') {
                                    // Handle case where it might be an object with product details
                                    productIds = Object.keys(parsed).filter(key => typeof key === 'string');
                                }
                            } catch (e) {
                                console.log("Could not parse order.items as JSON:", order.items);
                            }
                        } else if (Array.isArray(order.items)) {
                            // Filter valid product IDs
                            productIds = order.items
                                .filter(item => typeof item === 'string' || (typeof item === 'object' && item !== null))
                                .map(item => {
                                    if (typeof item === 'string') return item;
                                    // Handle object format like { id: 'product123', quantity: 2 }
                                    if (typeof item === 'object' && item !== null && 'id' in item) {
                                        return String((item as {id: string}).id);
                                    }
                                    return '';
                                })
                                .filter(id => id !== '');
                        }
                        
                        if (productIds.length > 0) {
                            // Fetch products in a single query
                            try {
                                const products = await prisma.product.findMany({
                                    where: {
                                        id: {
                                            in: productIds
                                        }
                                    },
                                    select: {
                                        id: true,
                                        name: true,
                                        price: true
                                    }
                                });
                                
                                // Map products to order items
                                orderItems = products.map(product => ({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    quantity: 1 // Default quantity
                                }));
                            } catch (productError) {
                                console.error(`Error fetching products for order ${order.id}:`, productError);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing items for order ${order.id}:`, error);
                    // Just return an empty array for this order's items
                }
                
                // Format shipping address
                let addressStr = "Хаяг оруулаагүй";
                try {
                    if (order.shippingAddress) {
                        const addr = typeof order.shippingAddress === 'object'
                            ? order.shippingAddress
                            : JSON.parse(String(order.shippingAddress));
                        
                        addressStr = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`;
                    }
                } catch (e) {
                    console.error("Error parsing shipping address:", e);
                    addressStr = String(order.shippingAddress || "");
                }
                
                // Try to get user information if available
                let userName = "Бүртгэлгүй хэрэглэгч";
                let userEmail = "Имэйл оруулаагүй";
                let userPhone = "Утасны дугаар оруулаагүй";
                
                if (order.userId) {
                    try {
                        const user = await prisma.user.findUnique({
                            where: { id: order.userId },
                            select: {
                                username: true,
                                email: true,
                                phoneNumber: true
                            }
                        });
                        
                        if (user) {
                            userName = user.username || userName;
                            userEmail = user.email || userEmail;
                            userPhone = user.phoneNumber?.toString() || userPhone;
                        }
                    } catch (userError) {
                        console.error(`Error fetching user for order ${order.id}:`, userError);
                    }
                }
                
                // Return formatted order
                return {
                    id: order.id,
                    customer: userName,
                    email: userEmail,
                    phone: userPhone,
                    address: addressStr,
                    amount: order.totalPrice || 0,
                    date: order.createdAt,
                    items: orderItems,
                    status: order.status || 'pending',
                    paymentMethod: order.paymentMethod || 'card', 
                    paymentStatus: order.paymentStatus === "Paid" ? "paid" : 
                                   order.paymentStatus === "Pending" ? "pending" : 
                                   (order.status === 'delivered' ? 'paid' : 
                                    order.status === 'cancelled' ? 'unpaid' : 'pending')
                };
            })
        );
        
        // Cache the results
        cachedOrders = formattedOrders;
        cachedTimestamp = now;
        
        console.log("Successfully formatted orders");
        return NextResponse.json(formattedOrders, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ 
            error: "Failed to fetch orders",
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

// Update an order's status
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { orderId, status } = body;
        
        if (!orderId || !status) {
            return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 });
        }
        
        // Check if order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId }
        });
        
        if (!existingOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        
        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        
        // Format updated order for response
        const formattedOrder = {
            id: updatedOrder.id,
            status: updatedOrder.status,
            paymentStatus: updatedOrder.paymentStatus === "Paid" ? "paid" :
                          updatedOrder.paymentStatus === "Pending" ? "pending" :
                          updatedOrder.status === 'delivered' ? 'paid' : 
                          updatedOrder.status === 'cancelled' ? 'unpaid' : 'pending'
        };
        
        // Invalidate cache to ensure fresh data on next GET
        cachedOrders = null;
        cachedTimestamp = 0;
        
        return NextResponse.json(formattedOrder, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ 
            error: "Failed to update order",
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