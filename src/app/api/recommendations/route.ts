import { NextResponse } from 'next/server';
import { algoliasearch } from 'algoliasearch';

import { INSTANT_SEARCH_INDEX_NAME } from '@/lib/constants/types';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const objectID = url.searchParams.get('objectID');

  if (!objectID) {
    return NextResponse.json(
      { error: 'Missing objectID parameter' },
      { status: 400 }
    );
  }

  try {
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'YUWLMDFM73',
      process.env.ALGOLIA_ADMIN_API_KEY || 'fc3a2d3d355a05bb237eb10b054a2464'
    ).initRecommend();

    const response = await client.getRecommendations({
      requests: [
        {
          indexName: "products",
          objectID: objectID,
          model: 'looking-similar',
          threshold: 0, 
          maxRecommendations: 4
        },
      ],
    });

    console.log(`Algolia recommendations for object ${objectID}:`, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Algolia Recommend API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
} 