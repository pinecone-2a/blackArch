"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Product } from './types';

type SimilarProductsProps = {
  productId: string;
  categoryId?: string;
};

// RatingStars component
const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${
            i < fullStars 
              ? 'text-yellow-400' 
              : i === fullStars && hasHalfStar 
                ? 'text-yellow-400' 
                : 'text-gray-300'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

const SimilarProducts: React.FC<SimilarProductsProps> = ({ productId, categoryId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      axios.get(`/api/products/similar?id=${productId}&category=${categoryId || ''}`)
        .then(response => {
          setProducts(response.data.slice(0, 5));
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error loading similar products:", error);
          setIsLoading(false);
        });
    }
  }, [productId, categoryId]);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Төстэй бараанууд</h2>
      
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-6 pl-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 min-w-[250px] sm:min-w-[280px]">
                <Skeleton className="w-[250px] h-[260px] sm:w-[280px] sm:h-[300px] rounded-xl" />
                <Skeleton className="h-6 w-3/4 mt-3" />
                <Skeleton className="h-7 w-1/2 mt-2" />
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link 
                key={product.id} 
                href={`/productDetail/${product.id}`}
                className="flex-shrink-0 min-w-[250px] sm:min-w-[280px] transition-transform hover:scale-105"
              >
                <div className="w-[250px] h-[260px] sm:w-[280px] sm:h-[300px] rounded-xl overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-base sm:text-lg font-semibold mt-3 truncate">
                  {product.name}
                </p>
                <p className="text-lg sm:text-xl font-bold mt-2">
                  ₮{Number(product.price).toLocaleString()}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full py-8">Төстэй бараа олдсонгүй</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarProducts; 