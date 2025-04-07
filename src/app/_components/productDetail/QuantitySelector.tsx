"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

type QuantitySelectorProps = {
    isLoading: boolean;
    quantity: number;
    onQuantityChange: (action: 'increase' | 'decrease') => void;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    isLoading,
    quantity,
    onQuantityChange
}) => {
    return (
        <div>
            {isLoading ? (
                <Skeleton className="w-32 h-12 rounded-lg" />
            ) : (
                <div className='flex items-center gap-4'>
                    <button
                        className='px-4 py-2 bg-gray-200 rounded-lg transition-all duration-300 cursor-grab'
                        onClick={() => onQuantityChange('decrease')}
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span>{quantity}</span>
                    <button 
                        className='px-4 py-2 bg-gray-200 rounded-lg transition-all duration-300 cursor-grab'
                        onClick={() => onQuantityChange('increase')}
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuantitySelector; 