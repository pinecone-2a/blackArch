"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from 'lucide-react';

type SimilarProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
};

type SimilarProductsProps = {
  isLoading: boolean;
  products: SimilarProduct[];
  formatPrice: (price: number) => string;
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

const SimilarProducts: React.FC<SimilarProductsProps> = ({ 
  isLoading, 
  products, 
  formatPrice 
}) => {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className='text-2xl font-bold text-gray-900'>You Might Also Like</h2>
        <Button variant="ghost" className="gap-1" asChild>
          <Link href="/category">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link 
              key={product.id}
              href={`/productDetail/${product.id}`}
              className="group flex flex-col"
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:underline line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center mt-1">
                <RatingStars rating={product.rating} />
                <span className="text-xs text-gray-500 ml-1">
                  {product.rating}
                </span>
              </div>
              <p className="font-semibold mt-1">
                {formatPrice(product.price)}₮
              </p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default SimilarProducts; 