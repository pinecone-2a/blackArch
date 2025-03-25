import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";
import { INSTANT_SEARCH_INDEX_NAME } from "@/lib/constants/types";
import dotenv from 'dotenv';
require('dotenv').config()

console.log(INSTANT_SEARCH_INDEX_NAME);
const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env);
const index = client.initIndex(INSTANT_SEARCH_INDEX_NAME);

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

    // ✅ Create product in Prisma
    const product = await prisma.product.create({
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

    // ✅ Upload product to Algolia
    await index.saveObject({
      objectID: product.id, // Prisma ID as Algolia objectID
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
      rating: product.rating,
      image: product.image,
      color: product.color,
      size: product.size,
    });

    return NextResponse.json({ message: "Product created & indexed", status: 200 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};
