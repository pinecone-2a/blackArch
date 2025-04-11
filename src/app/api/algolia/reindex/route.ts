import { NextResponse } from 'next/server';
import prisma from '@/lib/connect';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const algoliasearch = require('algoliasearch');
import { INSTANT_SEARCH_INDEX_NAME } from '@/lib/constants/types';

export async function POST(req: Request) {
  try {
    // Simple security check - in production you should use proper authentication
    const body = await req.json().catch(() => ({}));
    const { secretKey } = body;
    
    // Verify the secret key - this is a basic security measure
    if (secretKey !== process.env.ALGOLIA_ADMIN_API_KEY && 
        secretKey !== 'fc3a2d3d355a05bb237eb10b054a2464') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Initialize Algolia client
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'YUWLMDFM73',
      process.env.ALGOLIA_ADMIN_API_KEY || 'fc3a2d3d355a05bb237eb10b054a2464'
    );
    
    // Initialize the product index (default is "products")
    const index = client.initIndex("products");
    
    // Get all products from the database
    console.log("Fetching all products from database...");
    const products = await prisma.product.findMany({
      include: {
        category: true,
      }
    });
    console.log(`Found ${products.length} products to reindex`);
    
    if (products.length === 0) {
      return NextResponse.json({
        message: "No products found to reindex",
        status: 200
      });
    }
    
    // Prepare objects for Algolia with proper formatting
    const algoliaObjects = products.map(product => ({
      objectID: product.id,
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      quantity: product.quantity,
      categoryId: product.categoryId,
      categoryName: product.category?.name,
      rating: product.rating,
      image: product.image,
      color: product.color,
      size: product.size,
    }));
    
    console.log("Sending products to Algolia...");
    
    // Use saveObjects to add or update objects in batch
    const result = await index.saveObjects(algoliaObjects);
    console.log("Algolia indexing result:", result);
    
    // Initialize the Recommend client to ensure data is available for recommendations
    const recommendClient = client.initRecommend();
    
    // Ensure we have proper settings for the recommendations
    await index.setSettings({
      attributesForFaceting: [
        'searchable(price)',
        'searchable(categoryId)',
        'searchable(categoryName)',
        'searchable(size)',
        'searchable(color)'
      ]
    });
    
    return NextResponse.json({
      message: "All products reindexed successfully in Algolia",
      count: products.length,
      status: 200
    });
  } catch (error) {
    console.error("Error reindexing products:", error);
    return NextResponse.json({
      error: "Failed to reindex products",
      details: error instanceof Error ? error.message : String(error),
      status: 500
    });
  }
} 