import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
        include: {
          products: true, 
        },
      });
    return NextResponse.json({ message: categories, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};


export const POST = async (req: Request) => {
  const body = await req.json();
  const {name, description} = body

  try {
    const products = await prisma.category.create({
      data: {
        name,
        description,

      },
    });
    return NextResponse.json({ message: products, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};


