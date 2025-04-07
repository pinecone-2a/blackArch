import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const GET = async () => {
    try {
      const order = await prisma.order.findMany();
      return NextResponse.json({ message: order, status: 200 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  };

  export const POST = async (req: Request) => {
    const body = await req.json();

    let { userId, totalPrice, shippingAddress, items, paymentMethod } = body;
    
    try {
      console.log("Creating order with data:", {
        userId,
        totalPrice,
        itemsCount: items?.length || 0,
        paymentMethod
      });
      
      // Reject guest users or invalid user IDs
      if (userId === "guest" || !userId || !ObjectId.isValid(userId)) {
        console.log("Rejecting order from guest user");
        return NextResponse.json({ 
          error: "Authentication required. Please log in to place an order.", 
          status: 401 
        }, { status: 401 });
      }
      
      const order = await prisma.order.create({
        data: {
            userId,
            status: "pending",
            totalPrice,
            items: items || [],
            shippingAddress,
            paymentMethod: paymentMethod || "cash" // Default to cash if not provided
        },
      });
      
      console.log("Order created successfully with ID:", order.id);
      
      return NextResponse.json({ 
        message: order, 
        status: 200,
        orderId: order.id  // Explicitly include the order ID in the response
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  };
  