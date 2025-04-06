import prisma from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");
  const productId = url.searchParams.get("productId");
  const limit = url.searchParams.get("limit") || "5";

  if (!categoryId) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const similarProducts = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
        ...(productId && { id: { not: productId } }),
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        rating: true,
      },
      take: parseInt(limit),
    });

    return NextResponse.json(similarProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}; 