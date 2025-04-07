"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, SimilarProduct } from './types';
import toast from 'react-hot-toast';

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
        // Get the base URL based on environment
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        
        // Fetch product data from the API with credentials
        const response = await axios.get(`${baseUrl}/api/products/${productId}`, {
          withCredentials: true
        });
        
        const productData = response.data;
        setProduct(productData);
        setMainImage(productData.image);
        
        // Set up product images from API
        const images = [];
        
        // Always add the main image first
        if (productData.image) {
          images.push(productData.image);
        }
        
        // Add additional images if available from the API
        if (productData.images && productData.images.length > 0) {
          images.push(...productData.images);
        }
        
        setProductImages(images);
        
        // Fetch similar products if we have a category ID
        if (productData.categoryId) {
          try {
            const similarResponse = await axios.get(`${baseUrl}/api/products/similar?categoryId=${productData.categoryId}&productId=${productId}`, {
              withCredentials: true
            });
            setSimilarProducts(similarResponse.data);
          } catch (error) {
            console.error('Error fetching similar products:', error);
            setSimilarProducts([]);
          }
        } else {
          setSimilarProducts([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product data:', error);
        toast.error("Failed to load product data. Please try again later.");
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