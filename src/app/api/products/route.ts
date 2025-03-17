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


export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { name, description, price, quantity, categoryId, rating, image, color, size } = body;

    const products = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        categoryId,
        rating,
        image,
        color,  // Assuming it's an array, make sure Prisma model defines this field as an array
        size,    // Same for size, ensure it's an array if you plan to store it that way
      },
    });

    return NextResponse.json({ message: products, status: 200 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};



