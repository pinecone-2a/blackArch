import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/lib/algolia/adminClient";

export const GET = async (req: NextRequest, { params }: { params: Promise< { id: string }> }) => {
  const {id} = await params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing category ID" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category, status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest, { params }: { params: Promise< { id: string }> }) => {
  const {id} =  await params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing category ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    // Get the previous category data
    const previousCategory = await prisma.category.findUnique({
      where: { id },
      select: { name: true }
    });

    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    // Check if name has changed and update all associated products in Algolia
    if (previousCategory && previousCategory.name !== name) {
      console.log(`Category name changed from "${previousCategory.name}" to "${name}". Updating products in Algolia...`);
      
      // Get all products in this category
      const products = await prisma.product.findMany({
        where: { categoryId: id }
      });
      
      console.log(`Found ${products.length} products to update in Algolia`);
      
      // Update each product in Algolia
      const updatePromises = products.map(product => updateProduct(product));
      await Promise.allSettled(updatePromises);
      
      console.log(`Finished updating products with new category name in Algolia`);
    }

    return NextResponse.json({ 
      message: "Category updated", 
      category, 
      productsUpdated: previousCategory?.name !== name,
      status: 200 
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise <{ id: string } >}) => {
  const {id} = await params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing category ID" },
        { status: 400 }
      );
    }

    // First check if the category has associated products
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true },
          take: 1, // We only need to know if any exist
        },
      },
    });

    if (categoryWithProducts?.products.length) {
      return NextResponse.json(
        { error: "Cannot delete category with associated products" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted", status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
