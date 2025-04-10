import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const orderId = params.id;
        
        // Fetch order with user information
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });
        
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        
        let orderItems: OrderItem[] = [];
        if (order.items && order.items.length > 0) {
            try {
                const productIds = order.items;
                const products = await prisma.product.findMany({
                    where: {
                        id: {
                            in: productIds.filter(id => typeof id === 'string')
                        }
                    }
                });
                
                orderItems = products.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1 // Default quantity
                }));
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        }
        
        const formattedOrder = {
            id: order.id,
            customer: order.user.username,
            email: order.user.email,
            phone: order.user.phoneNumber?.toString() || 'Not provided',
            address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`,
            amount: order.totalPrice,
            date: order.createdAt,
            items: orderItems,
            status: order.status,
            paymentMethod: 'credit_card', // Default
            paymentStatus: order.status === 'delivered' ? 'paid' : 
                         order.status === 'cancelled' ? 'unpaid' : 'pending'
        };
        
        return NextResponse.json(formattedOrder, { status: 200 });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const orderId = params.id;
        const body = await request.json();
        const { status } = body;
        
        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }
        
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId }
        });
        
        if (!existingOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { user: true }
        });
        
        return NextResponse.json({
            id: updatedOrder.id,
            status: updatedOrder.status,
            paymentStatus: updatedOrder.paymentStatus === "Paid" ? "paid" :
                           updatedOrder.paymentStatus === "Pending" ? "pending" :
                           updatedOrder.status === 'delivered' ? 'paid' : 
                           updatedOrder.status === 'cancelled' ? 'unpaid' : 'pending'
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
} 