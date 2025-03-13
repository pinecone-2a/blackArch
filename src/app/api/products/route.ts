import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ message: products, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};


export const POST = async () => {
  try {
    const products = await prisma.product.create({
      data: {
        name: "tshirt",
        description: "dddd",
        price: 100,
        quantity: 2

      },
    });
    return NextResponse.json({ message: products, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};


