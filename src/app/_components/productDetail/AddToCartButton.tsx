"use client"
import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

type AddToCartButtonProps = {
    isLoading: boolean;
    onAddToCart: () => void;
    disabled?: boolean;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    isLoading,
    onAddToCart,
    disabled = false
}) => {
    const [ripple, setRipple] = useState(false);

    const handleClick = () => {
        setRipple(true);
        onAddToCart();
        setTimeout(() => setRipple(false), 600);
    };

    return (
        <div>
            {isLoading ? (
                <Skeleton className="w-36 h-12 rounded-full" />
            ) : (
                <button
                    className={`relative py-2 px-8 bg-black text-white rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${ripple ? 'after:animate-ripple' : ''}`}
                    onClick={handleClick}
                    disabled={disabled}
                >
                    Сагсанд нэмэх
                </button>
            )}
        </div>
    );
};

export default AddToCartButton; 