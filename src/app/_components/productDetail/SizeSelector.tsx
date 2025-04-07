"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

type SizeSelectorProps = {
    isLoading: boolean;
    selectedSize: string;
    onSizeSelect: (size: string) => void;
    sizeOptions?: string[];
};

const DEFAULT_SIZES = ['Small', 'Medium', 'Large', 'X-Large'];

const SizeSelector: React.FC<SizeSelectorProps> = ({
    isLoading,
    selectedSize,
    onSizeSelect,
    sizeOptions = DEFAULT_SIZES
}) => {
    return (
        <div>
            <p className='text-lg font-bold mt-18'>Хэмжээ</p>
            
            {isLoading ? (
                <div className="flex gap-5 mt-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="w-24 h-10 rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className='flex gap-5 mt-2'>
                    {sizeOptions.map((size) => (
                        <button
                            key={size}
                            className={`px-4 py-2 border rounded-lg transition-all duration-300 ease-out cursor-grab
                                hover:bg-gray-200 hover:text-black transform
                                active:scale-90 
                                ${selectedSize === size ? 'bg-black text-white shadow-md scale-105' : ''}`}
                            onClick={() => onSizeSelect(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SizeSelector; 