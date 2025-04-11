import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Hit {
  name: string;
  description: string;
  image: string;
  objectID?: string;
  id?: string;
  price?: number;
  rating?: number;
  discount?: number;
  category?: string;
  categoryId?: string;
  categoryName?: string;
}

const HitComponent = ({ hit }: { hit: Hit }) => {
  const discountPercent = hit.discount ? Math.round(hit.discount) : null;
  const formattedPrice = hit.price ? `${hit.price}₮` : "";
  const originalPrice = hit.price && hit.discount ? 
    Math.round(hit.price / (1 - hit.discount / 100)) : null;
  
  // Make sure we have a valid ID to link to
  const productId = hit.id || hit.objectID;
  
  // Don't render if no valid ID found
  if (!productId) {
    console.error('Product missing ID', hit);
    return null;
  }

  const renderStars = (rating: number = 4) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-3 h-3 text-yellow-500" />
        );
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <Link href={`/productDetail/${productId}`} className="block"> 
      <div className="flex items-start p-4 bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 gap-4">
        <div className="shrink-0 relative">
          <img 
            className="h-24 w-24 object-cover rounded-lg shadow-sm" 
            src={hit.image} 
            alt={`${hit.name} product image`} 
          />
          {discountPercent && (
            <Badge variant="destructive" className="absolute top-1 right-1 text-xs">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1">
            {hit.name}
          </h3>
          
          {(hit.categoryName || hit.category) && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mb-1.5">
              {hit.categoryName || hit.category}
            </span>
          )}
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-1.5">
            {hit.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
         
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{formattedPrice}</span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">{originalPrice}₮</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="shrink-0 self-center ml-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HitComponent;