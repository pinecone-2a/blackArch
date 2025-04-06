"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, SimilarProduct } from './types';
import toast from 'react-hot-toast';

// Sample images for the product gallery (fallback images)
const sampleProductImages = [
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1664&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=1974&auto=format&fit=crop'
];

// Sample similar products
const sampleSimilarProducts: SimilarProduct[] = [
  {
    id: '101',
    name: 'Classic Casual T-Shirt',
    price: 29000,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
    rating: 4.7
  },
  {
    id: '102',
    name: 'Urban Style Hoodie',
    price: 67000,
    image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=1935&auto=format&fit=crop',
    rating: 4.9
  },
  {
    id: '103',
    name: 'Premium Denim Jacket',
    price: 115000,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1974&auto=format&fit=crop',
    rating: 4.8
  },
  {
    id: '104',
    name: 'Comfortable Sport Leggings',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1974&auto=format&fit=crop',
    rating: 4.5
  },
  {
    id: '105',
    name: 'Outdoor Adventure Jacket',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop',
    rating: 4.6
  }
];

export const useProductDetail = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);

  // Format price with spacing
  const formatPrice = (price: number) => {
    return price?.toLocaleString().replace(/,/g, ' ');
  };

  // Get product data
  useEffect(() => {
    const getProductData = async () => {
      setIsLoading(true);
      try {
        // Fetch product data from the API
        const response = await axios.get(`/api/products/${productId}`);
        const productData = response.data;
        setProduct(productData);
        setMainImage(productData.image);
        
        // Set up product images - use API images if available, otherwise fallback to sample images
        const images = [];
        
        // Always add the main image first
        images.push(productData.image);
        
        // Add additional images if available from the API
        if (productData.images && productData.images.length > 0) {
          images.push(...productData.images);
        } else {
          // Fallback to sample images if no additional images from API
          images.push(...sampleProductImages);
        }
        
        setProductImages(images);
        
        // Fetch similar products if we have a category ID
        if (productData.categoryId) {
          try {
            const similarResponse = await axios.get(`/api/products/similar?categoryId=${productData.categoryId}&productId=${productId}`);
            setSimilarProducts(similarResponse.data);
          } catch (error) {
            console.error('Error fetching similar products:', error);
            // Fallback to sample similar products
            setSimilarProducts(sampleSimilarProducts);
          }
        } else {
          setSimilarProducts(sampleSimilarProducts);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        // If API fails, use mock data as fallback
        const mockProduct: Product = {
          id: productId,
          name: 'Premium Urban Streetwear Hoodie',
          price: 78000,
          discount: 15,
          description: 'Stay comfortable and stylish with our premium quality urban streetwear hoodie. Made from soft cotton blend, perfect for everyday wear. Features a modern design with practical pockets and premium stitching details.',
          image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1970&auto=format&fit=crop',
          images: sampleProductImages,
          rating: 4.8,
          categoryId: '2',
          categoryName: 'Hoodies & Sweatshirts'
        };
        
        setProduct(mockProduct);
        setMainImage(mockProduct.image);
        setProductImages([mockProduct.image, ...sampleProductImages]);
        setSimilarProducts(sampleSimilarProducts);
        setIsLoading(false);
      }
    };
    
    getProductData();
    
    // Check if item is in wishlist
    const checkWishlist = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlist(wishlist.some((item: any) => item.id === productId));
    };
    
    checkWishlist();
  }, [productId]);

  // Toggle wishlist status
  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlist) {
      const newWishlist = wishlist.filter((item: any) => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlist(false);
      toast.success('Item removed from wishlist!');
    } else {
      if (product) {
        wishlist.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setIsWishlist(true);
        toast.success('Item added to wishlist!');
      }
    }
  };

  // Handle image navigation
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
    setMainImage(productImages[index] || '');
  };

  const nextImage = () => {
    const totalImages = productImages.length;
    const newIndex = (currentImageIndex + 1) % totalImages;
    handleImageChange(newIndex);
  };

  const prevImage = () => {
    const totalImages = productImages.length;
    const newIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    handleImageChange(newIndex);
  };

  // Add to cart handler
  const handleAddToCart = (color: string, size: string, quantity: number) => {
    if (!product) return;
    
    try {
      let cart = [];
      
      // Try to get existing cart from localStorage
      try {
        const existingCart = localStorage.getItem('cart');
        if (existingCart) {
          cart = JSON.parse(existingCart);
        }
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        // If there's an error parsing, start with an empty cart
        cart = [];
      }
      
      // Check if product is already in cart
      const existingProductIndex = cart.findIndex((item: any) => 
        item.id === product.id && item.color === color && item.size === size
      );
      
      if (existingProductIndex !== -1) {
        // Update quantity if product is already in cart
        cart[existingProductIndex].quantity += quantity;
        toast.success(`Updated quantity in cart!`);
      } else {
        // Add new product to cart
        cart.push({
          id: product.id,
          name: product.name,
          image: product.image,
          color,
          size,
          quantity,
          price: product.price
        });
        toast.success("Added to cart successfully!");
      }
      
      // Save updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Update cart icon or counter (if needed)
      const event = new CustomEvent('cartUpdated', { 
        detail: { cartItems: cart.length } 
      });
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  return {
    product,
    isLoading,
    mainImage,
    isWishlist,
    productImages,
    similarProducts,
    formatPrice,
    toggleWishlist,
    handleImageChange,
    nextImage,
    prevImage,
    handleAddToCart,
    currentImageIndex,
    shake,
    setShake,
    ripple,
    setRipple
  };
}; 