"use client";

import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Heart, ZoomIn } from 'lucide-react';

type ProductImageGalleryProps = {
  isLoading: boolean;
  mainImage: string;
  productName?: string;
  productImages: string[];
  isWishlist: boolean;
  onToggleWishlist: () => void;
  currentImageIndex?: number;
  onImageChange?: (index: number) => void;
};

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  isLoading,
  mainImage,
  productName,
  productImages,
  isWishlist,
  onToggleWishlist,
  currentImageIndex: externalCurrentIndex,
  onImageChange
}) => {
  const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const currentImageIndex = typeof externalCurrentIndex !== 'undefined' 
    ? externalCurrentIndex 
    : internalCurrentIndex;

  const handleImageChange = (index: number) => {
    if (onImageChange) {
      onImageChange(index);
    } else {
      setInternalCurrentIndex(index);
    }
    // Reset zoom when changing images
    setIsZoomed(false);
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % productImages.length;
    handleImageChange(newIndex);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    handleImageChange(newIndex);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-6">
      {/* Main product image - with larger size and consistent aspect ratio */}
      <div className="relative rounded-lg overflow-hidden bg-white aspect-square w-full max-w-[100%] h-auto">
        {isLoading ? (
          <Skeleton className="absolute inset-0" />
        ) : (
          <>
            <div className="w-full h-full flex items-center justify-center bg-white">
              <img 
                src={productImages[currentImageIndex] || mainImage} 
                alt={productName || 'Product'}
                className={`w-full h-full transition-all duration-500 ${
                  isZoomed 
                    ? 'scale-150 cursor-zoom-out' 
                    : 'hover:scale-105 cursor-zoom-in'
                }`}
                style={{ objectFit: 'contain' }}
                onClick={toggleZoom}
              />
            </div>
            
            {/* Image navigation arrows - hide when zoomed */}
            {!isZoomed && productImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-md transition-all transform hover:scale-110 z-10"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-md transition-all transform hover:scale-110 z-10"
                  aria-label="Next image"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            )}
            
            {/* Action buttons - wishlist and zoom */}
            {!isZoomed && (
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                  className="bg-white p-2.5 rounded-full shadow-md transition-all transform hover:scale-110"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
                  className="bg-white p-2.5 rounded-full shadow-md transition-all transform hover:scale-110"
                  aria-label="Add to wishlist"
                >
                  <Heart 
                    className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
                  />
                </button>
              </div>
            )}
            
            {/* Image counter indicator */}
            {!isZoomed && productImages.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full text-sm font-medium z-10">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Thumbnail gallery - with larger, consistent sizing */}
      {productImages.length > 1 && (
        <div className="flex space-x-4 overflow-x-auto pb-2 justify-center">
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-24 h-24 rounded-md flex-shrink-0" />
            ))
          ) : (
            productImages.map((image, index) => (
              <button 
                key={index}
                onClick={() => handleImageChange(index)}
                className={`relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                  currentImageIndex === index 
                    ? 'border-2 border-black shadow-md scale-105' 
                    : 'border border-gray-200 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <img 
                    src={image} 
                    alt={`${productName || 'Product'} view ${index + 1}`} 
                    className="w-full h-full"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </button>
            ))
          )}
        </div>
      )}
      
      {/* Dot indicators for mobile - shown only when there are multiple images */}
      {productImages.length > 1 && (
        <div className="flex items-center justify-center space-x-2 md:hidden">
          {productImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentImageIndex === index 
                  ? 'bg-black w-3.5 h-3.5' 
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery; 