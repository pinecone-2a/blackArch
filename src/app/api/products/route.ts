import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import { indexProduct, updateProduct, deleteProduct } from "@/lib/algolia/adminClient";
import dotenv from 'dotenv';
require('dotenv').config()

// Remove any previous Algolia client initialization

export const GET = async () => {
  try {
    console.time("product-fetch");
const products = await prisma.product.findMany();
console.timeEnd("product-fetch");

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

    // Upload product to Algolia
    try {
      await indexProduct(product);
    } catch (algoliaError) {
      console.error("Error indexing product in Algolia:", algoliaError);
      // Continue even if Algolia indexing fails
    }

    return NextResponse.json({ message: "Product created & indexed", status: 200 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log("PUT /api/products request body:", body);
    const { id, name, description, price, quantity, categoryId, rating, image, color, size, images } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required", status: 400 });
    }

    // Validate image URL
    if (!image) {
      console.warn("Product update attempted without image URL");
    }

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
        images,
      },
    });

    console.log("Product updated in database:", product);

    // Update product in Algolia
    try {
      await updateProduct(product);
      console.log("Product updated in Algolia:", id);
    } catch (algoliaError) {
      console.error("Error updating product in Algolia:", algoliaError);
      // Continue even if Algolia indexing fails
    }

    return NextResponse.json({ message: "Product updated", product, status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error),
      status: 500 
    });
  }
}

export async function DELETE(req: Request) {
  try {
    // Get the product ID from the URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required", status: 400 });
    }

    // Delete the product from the database
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (dbError) {
      console.error(`Error deleting product ${id} from database:`, dbError);
      return NextResponse.json({ 
        error: "Failed to delete product from database", 
        details: dbError instanceof Error ? dbError.message : String(dbError),
        status: 500 
      });
    }

    // Delete product from Algolia
    let algoliaResult = false;
    try {
      algoliaResult = await deleteProduct(id);
    } catch (algoliaError) {
      console.error(`Error deleting product ${id} from Algolia:`, algoliaError);
    }
    
    if (!algoliaResult) {
      return NextResponse.json({ 
        message: `Product ${id} deleted from database, but Algolia deletion may have failed`, 
        algoliaSuccess: false,
        status: 207  // 207 Multi-Status
      });
    }

    return NextResponse.json({ 
      message: `Product ${id} deleted successfully from database and Algolia`, 
      algoliaSuccess: true,
      status: 200 
    });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error),
      status: 500 
    });
  }
}
