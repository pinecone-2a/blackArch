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

    console.log(`Attempting to delete product with ID: ${id}`);

    // First delete the product from Algolia to ensure it's removed even if DB deletion fails
    let algoliaResult = false;
    try {
      console.log(`Deleting product ${id} from Algolia index...`);
      algoliaResult = await deleteProduct(id);
      console.log(`Algolia deletion result: ${algoliaResult ? 'Success' : 'Failed'}`);
    } catch (algoliaError) {
      console.error(`Error deleting product ${id} from Algolia:`, algoliaError);
    }

    // Delete the product from the database
    try {
      console.log(`Deleting product ${id} from database...`);
      await prisma.product.delete({
        where: { id },
      });
      console.log(`Successfully deleted product ${id} from database`);
    } catch (dbError) {
      console.error(`Error deleting product ${id} from database:`, dbError);
      
      // If Algolia deletion succeeded but DB deletion failed, we need to inform the user
      if (algoliaResult) {
        return NextResponse.json({ 
          error: "Failed to delete product from database, but removed from search index", 
          details: dbError instanceof Error ? dbError.message : String(dbError),
          algoliaSuccess: true,
          status: 500 
        });
      }
      
      return NextResponse.json({ 
        error: "Failed to delete product from database", 
        details: dbError instanceof Error ? dbError.message : String(dbError),
        status: 500 
      });
    }
    
    // If we reached here, the database deletion was successful
    // Return appropriate response based on Algolia result
    if (!algoliaResult) {
      console.warn(`Warning: Product ${id} was deleted from database but may still appear in search results`);
      return NextResponse.json({ 
        message: `Product ${id} deleted from database, but might still appear in search results`, 
        warning: "The product was deleted from your database but failed to be removed from the search index. It may still appear in search results.",
        algoliaSuccess: false,
        status: 207  // 207 Multi-Status
      });
    }

    console.log(`Product ${id} successfully deleted from both database and Algolia`);
    return NextResponse.json({ 
      message: `Product ${id} deleted successfully`, 
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
