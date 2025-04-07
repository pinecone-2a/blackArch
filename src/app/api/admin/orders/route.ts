import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export async function GET() {
    try {
        // Fetch all orders with user information
        const orders = await prisma.order.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        // Format orders for frontend consumption
        const formattedOrders = await Promise.all(orders.map(async (order) => {
            // Parse items array (which should contain product IDs)
            let orderItems: OrderItem[] = [];
            try {
                if (order.items && order.items.length > 0) {
                    // Fetch product details for each item
                    const productIds = order.items;
                    const products = await prisma.product.findMany({
                        where: {
                            id: {
                                in: productIds.filter(id => typeof id === 'string')
                            }
                        }
                    });
                    
                    // Create items with product details
                    orderItems = products.map(product => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1 // Default quantity as it's not stored in the schema
                    }));
                }
            } catch (error) {
                console.error("Error processing order items:", error);
            }
            
            return {
                id: order.id,
                customer: order.user.username,
                email: order.user.email,
                phone: order.user.phoneNumber?.toString() || 'Not provided',
                address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`,
                amount: order.totalPrice,
                date: order.createdAt,
                items: orderItems,
                status: order.status,
                paymentMethod: 'credit_card', // This isn't in the schema, default for now
                paymentStatus: order.status === 'delivered' ? 'paid' : 
                              order.status === 'cancelled' ? 'unpaid' : 'pending'
            };
        }));
        
        return NextResponse.json(formattedOrders, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
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
            data: { status },
            include: { user: true }
        });
        
        // Format updated order for response
        const formattedOrder = {
            id: updatedOrder.id,
            customer: updatedOrder.user.username,
            email: updatedOrder.user.email,
            status: updatedOrder.status,
            paymentStatus: updatedOrder.status === 'delivered' ? 'paid' : 
                          updatedOrder.status === 'cancelled' ? 'unpaid' : 'pending'
        };
        
        return NextResponse.json(formattedOrder, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
} 