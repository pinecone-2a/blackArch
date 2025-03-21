import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const newProducts = await prisma.product.findMany({
      
            orderBy: { createdAt: "desc" },
            take: 5,
        
    })
    return NextResponse.json({ message: newProducts, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};






