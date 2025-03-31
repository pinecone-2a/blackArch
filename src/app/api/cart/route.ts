import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const body = await req.json();

    const { userId, totalPrice, shippingAddress, } = body;
    
    try {
      const order = await prisma.order.create({
        data: {
            userId,
            status: "pending",
            totalPrice,
            shippingAddress
        },
      });
      return NextResponse.json({ message: order, status: 200 });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  };