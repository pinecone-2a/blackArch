"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Minus, Plus, ShoppingCart, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Product = {
  name?: string;
  price?: number;
  discount?: number;
  description?: string;
  rating?: number;
};

type ProductInfoProps = {
  isLoading: boolean;
  product: Product;
  onAddToCart: (color: string, size: string, quantity: number) => void;
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
          className={`w-4 h-4 ${
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
          {i === fullStars && hasHalfStar ? (
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          )}
        </svg>
      ))}
    </div>
  );
};

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  isLoading, 
  product, 
  onAddToCart,
  formatPrice
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [ripple, setRipple] = useState(false);
  const [shake, setShake] = useState(false);
  
  // Colors data
  const colorOptions = [
    { color: 'green', label: 'Green', bgColor: 'bg-green-700', ringColor: 'hover:ring-green-500' },
    { color: 'black', label: 'Black', bgColor: 'bg-black', ringColor: 'hover:ring-gray-500' },
    { color: 'gray', label: 'Gray', bgColor: 'bg-gray-700', ringColor: 'hover:ring-gray-400' },
    { color: 'red', label: 'Red', bgColor: 'bg-red-700', ringColor: 'hover:ring-red-500' },
    { color: 'pink', label: 'Pink', bgColor: 'bg-pink-400', ringColor: 'hover:ring-pink-500' },
    { color: 'blue', label: 'Blue', bgColor: 'bg-blue-700', ringColor: 'hover:ring-blue-500' }
  ];

  // Size options
  const sizeOptions = ['Small', 'Medium', 'Large', 'X-Large'];

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCartClick = () => {
    // Validate required selections
    if (!selectedColor && !selectedSize) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Please select both color and size");
      return;
    }
    
    if (!selectedColor) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Please select a color");
      return;
    }
    
    if (!selectedSize) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Please select a size");
      return;
    }
    
    // If validation passes, show success animation and add to cart
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    
    // Call the onAddToCart function with the selected options
    onAddToCart(selectedColor, selectedSize, quantity);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <>
          <Skeleton className="h-10 w-4/5" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-10 h-10 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-36" />
          <div className="flex gap-4">
            {Array(4).fill(0).map((_, index) => (
              <Skeleton key={index} className="w-24 h-10 rounded-lg" />
            ))}
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </>
      ) : (
        <>
          {/* Product name */}
          <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-gray-900'>
            {product?.name}
          </h1>
          
          {/* Ratings */}
          <div className='flex items-center'>
            <div className="flex items-center">
              <RatingStars rating={product?.rating || 4.5} />
              <span className='ml-2 text-sm text-gray-500'>
                {product?.rating || 4.5}/5 (24 reviews)
              </span>
            </div>
          </div>
          
          {/* Price */}
          <div className='flex items-center space-x-4'>
            <span className='text-2xl sm:text-3xl font-bold text-gray-900'>
              {product?.price ? `${formatPrice(product.price)}₮` : ''}
            </span>
            
            {product?.discount && product.discount > 0 && (
              <>
                <span className='text-lg sm:text-xl text-gray-500 line-through'>
                  {formatPrice(product.price * (1 + product.discount / 100))}₮
                </span>
                <span className='text-sm px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium'>
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Product description */}
          <Tabs defaultValue="description" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-2">
              <p className='text-gray-700'>
                {product?.description}
              </p>
            </TabsContent>
            
            <TabsContent value="details" className="pt-2">
              <ul className="space-y-2 text-gray-700">
                <li>• Premium quality material</li>
                <li>• Comfortable fit</li>
                <li>• Machine washable</li>
                <li>• 100% authentic</li>
                <li>• Designed in Mongolia</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="shipping" className="pt-2">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Truck className="w-5 h-5 mr-2 text-gray-700 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Free shipping on orders over 50,000₮</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="w-5 h-5 mr-2 text-gray-700 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Secure payment options</span>
                </li>
                <li className="flex items-start">
                  <RefreshCcw className="w-5 h-5 mr-2 text-gray-700 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">30 days return policy</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>
          
          {/* Color selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className='text-sm font-medium text-gray-900'>
                Color: <span className="capitalize">{selectedColor || 'Select a color'}</span>
              </label>
              {!selectedColor && (
                <span className="text-xs text-red-500">Required</span>
              )}
            </div>
            
            <div className='flex flex-wrap gap-3'>
              {colorOptions.map(({ color, label, bgColor, ringColor }) => (
                <button
                  key={color}
                  aria-label={`Select ${label} color`}
                  className={`relative w-10 h-10 rounded-full ${bgColor} hover:ring-4 transition duration-300 flex items-center justify-center
                      ${selectedColor === color ? 'ring-4 ring-black/30' : ''} ${ringColor}`}
                  onClick={() => handleColorClick(color)}
                >
                  {selectedColor === color && (
                    <Check className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Size selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className='text-sm font-medium text-gray-900'>
                Size: <span>{selectedSize || 'Select a size'}</span>
              </label>
              {!selectedSize && (
                <span className="text-xs text-red-500">Required</span>
              )}
              <button className="text-xs text-blue-600 underline">Size guide</button>
            </div>
            
            <div className='flex flex-wrap gap-3'>
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-lg transition-all duration-300 ease-out
                  hover:bg-gray-100
                  ${selectedSize === size 
                      ? 'bg-black text-white border-black' 
                      : 'border-gray-300 text-gray-700'}`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity selector and add to cart */}
          <div className='flex flex-wrap gap-4 items-center pt-4'>
            <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden'>
              <button
                className='px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors'
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className='w-12 text-center font-medium'>{quantity}</span>
              
              <button
                className='px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors'
                onClick={() => handleQuantityChange('increase')}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <Button
              className={`relative flex-1 gap-2 py-6 font-medium bg-black text-white hover:bg-gray-800 shadow-lg
              transition-all duration-300 ${shake ? 'animate-shake' : ''}`}
              onClick={handleAddToCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
              {ripple && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-20 h-20 bg-white opacity-30 rounded-full animate-ping"></span>
                </span>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="p-2.5" 
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Product tags */}
          <div className="pt-4">
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded-full">Streetwear</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full">Casual</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full">Fashion</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full">Urban</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductInfo; 