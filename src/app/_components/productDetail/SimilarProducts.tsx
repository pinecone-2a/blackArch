"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { INSTANT_SEARCH_INDEX_NAME } from '@/lib/constants/types';

interface SimilarProductsProps {
  productId: string;
  indexName?: string;
}

interface RecommendedProduct {
  objectID: string;
  id: string;
  name: string;
  image: string;
  price: number;
  categoryName?: string;
}

export function SimilarProducts({ productId, indexName = INSTANT_SEARCH_INDEX_NAME }: SimilarProductsProps) {
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!productId) return;
      
      try {
        setLoading(true);
        
        // First try to get recommendations from Algolia's recommendation API
        try {
          // Call our new recommendations API
          const response = await axios.get(`/api/recommendations?objectID=${productId}`);
          
          if (response.data && 
              response.data.results && 
              response.data.results[0] && 
              response.data.results[0].hits && 
              response.data.results[0].hits.length > 0) {
            
            console.log('Algolia similar products found:', response.data.results[0].hits.length);
            setRecommendedProducts(response.data.results[0].hits);
            setLoading(false);
            return;
          } else {
            console.log('No Algolia recommendations found, falling back to regular products');
          }
        } catch (algoliaError) {
          console.error("Error fetching from Algolia recommendations:", algoliaError);
        }
        
        // Fallback to API if Algolia recommendations fail
        try {
          const backupResponse = await axios.get('/api/products');
          
          if (backupResponse.data && Array.isArray(backupResponse.data.message)) {
            // Filter out the current product and take 4 random products
            const products = backupResponse.data.message
              .filter((p: any) => p.id !== productId)
              .slice(0, 4);
            
            console.log('Fallback products from API:', products.length);
            setRecommendedProducts(products);
          }
        } catch (apiError) {
          console.error("Error fetching from fallback API:", apiError);
        }
      } catch (error) {
        console.error("Error in recommendation process:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [productId, indexName]);

  return (
    <div className="mt-12 mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Санал болгох бүтээгдэхүүнүүд</h2>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white h-[320px] rounded-xl border shadow-sm p-3 flex flex-col items-center relative overflow-hidden">
              <Skeleton className="w-full h-[180px] rounded-lg" />
              <Skeleton className="w-3/4 h-4 mt-3 rounded" />
              <Skeleton className="w-1/2 h-6 mt-2 rounded" />
              <div className="absolute bottom-0 w-full">
                <Skeleton className="w-full h-10 rounded-b-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : recommendedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
          {recommendedProducts.map((product) => (
            <Link
              key={product.id || product.objectID}
              href={`/productDetail/${product.id || product.objectID}`}
              className="transform transition-transform hover:scale-[1.02]"
            >
              <div className="group bg-white h-[320px] rounded-xl border shadow-sm p-3 flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out">
                <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain h-full w-full p-2 transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="mt-3 w-full text-center">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                    {product.name}
                  </h3>
                  {product.categoryName && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block my-1">
                      {product.categoryName}
                    </span>
                  )}
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    ₮{Number(product.price).toLocaleString()}
                  </p>
                </div>
                <div className="absolute bottom-0 w-full">
                  <Button className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out w-full rounded-t-none rounded-b-xl h-10 shadow-lg bg-black text-white hover:bg-gray-800">
                    Дэлгэрэнгүй
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">Санал болгох бүтээгдэхүүн олдсонгүй</p>
      )}
    </div>
  );
}

export default SimilarProducts; 