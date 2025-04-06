import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from 'mongodb';


export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const { id } = await context.params; 

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'Invalid product ID' }), { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};


export const PUT = async (req: NextRequest, context: { params: { id: string } }) => {
  const { id } = await context.params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description, price, quantity, categoryId, rating, image, color, size } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        quantity,
        categoryId,
        rating,
        image,
        color,
        size,
      },
    });

    return NextResponse.json({ message: "Product updated", product, status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
  const { id } = await context.params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted", status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
