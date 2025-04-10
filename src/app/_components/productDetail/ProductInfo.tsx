"use client";

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from './types';

type ProductInfoProps = {
    isLoading: boolean;
    product: Product | null;
};

const ProductInfo: React.FC<ProductInfoProps> = ({ isLoading, product }) => {
    return (
        <div>
            {isLoading ? (
                <>
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-10 w-28 mb-4" />
                    <Skeleton className="h-24 w-full mb-6" />
                </>
            ) : (
                <>
                    <h1 className='text-5xl font-bold'>{product?.name}</h1>
                    <div className='flex items-center gap-2 mt-5 text-4xl'>
                        <h2 className='font-bold'>₮{Number(product?.price || 0).toLocaleString()}</h2>
                        {product?.discount && product.discount > 0 && (
                            <span className='text-gray-500 line-through text-2xl'>
                                ₮{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                            </span>
                        )}
                    </div>
                    <p className='mt-5 text-gray-700 text-xl'>
                        {product?.description}
                    </p>
                </>
            )}
        </div>
    );
};

export default ProductInfo; 