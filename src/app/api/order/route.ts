import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
      const order = await prisma.order.findMany();
      return NextResponse.json({ message: order, status: 200 });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  };

  export const POST = async () => {
    try {
      const order = await prisma.order.create({
        data: {
            userId: "67d3e44eedfa44219a2e8e83",
            status: "pending",
            totalPrice: 20000,
            shippingAddress: {
              street: "123 Yurt St.",
              city: "Ulaanbaatar",
              state: "Ulaanbaatar",
              zip: "14192",
            },
  
        },
      });
      return NextResponse.json({ message: order, status: 200 });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
  };
  