"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';

// Components
import Header from '@/app/_components/homeHeader';
import Footer from '@/app/_components/homeFooter';
import ProductHeader from '@/app/_components/productDetail/ProductHeader';
import ProductInfo from '@/app/_components/productDetail/ProductInfo';
import ProductOptions from '@/app/_components/productDetail/ProductOptions';
import ProductImageGallery from '@/app/_components/productDetail/ProductImageGallery';
import SimilarProducts from '@/app/_components/productDetail/SimilarProducts';

// Types
import { Product } from '@/app/_components/productDetail/types';

// Define the proper params type for Next.js App Router
type PageProps = {
  params: {
    id: string;
  };
};

const ProductDetail = ({ params }: PageProps) => {
    const productId = params.id;
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isWishlist, setIsWishlist] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`/api/products/${productId}`)
            .then(response => {
                setProduct(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    }, [productId]);

    const handleToggleWishlist = () => {
        setIsWishlist(!isWishlist);
        // Implementation for adding/removing from wishlist would go here
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
                <Toaster position='top-center'/>
                
                <ProductHeader 
                    isLoading={isLoading} 
                    productName={product?.name}
                />

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 mb-12'>
                    <div>
                        <ProductImageGallery
                            isLoading={isLoading}
                            mainImage={product?.image || ''}
                            productName={product?.name}
                            productImages={product?.images || [product?.image || '']}
                            isWishlist={isWishlist}
                            onToggleWishlist={handleToggleWishlist}
                        />
                    </div>

                    <div className="space-y-8">
                        <ProductInfo 
                            isLoading={isLoading} 
                            product={product} 
                        />
                        
                        <ProductOptions 
                            isLoading={isLoading} 
                            product={product} 
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-12">
                    <SimilarProducts
                        productId={productId}
                        categoryId={product?.categoryId}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;
