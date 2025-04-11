"use client"
import React, { useState } from 'react';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';
import { Product } from './types';
import { toast } from 'sonner';

type ProductOptionsProps = {
    isLoading: boolean;
    product: Product | null;
};

const ProductOptions: React.FC<ProductOptionsProps> = ({
    isLoading,
    product
}) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [shake, setShake] = useState(false);

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    const handleQuantityChange = (action: 'increase' | 'decrease') => {
        if (action === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (!product || !product.id) {
            toast.error("Бүтээгдэхүүний мэдээлэл олдсонгүй");
            return;
        }
        
        if (!selectedSize) {
            setShake(true);
            setTimeout(() => setShake(false), 300);
            toast.error("Хэмжээг сонгоно уу");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push({
            productId: product.id,
            size: selectedSize,
            quantity: quantity,
            image: product.image,
            name: product.name,
            price: product.price,
            color: product.color && product.color.length > 0 ? product.color[0] : "",
            description: product.description
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success("Сагсанд амжилттай нэмэгдлээ!");
    };

    return (
        <div className={`space-y-6 ${shake ? 'animate-shake' : ''}`}>
            <SizeSelector
                isLoading={isLoading}
                selectedSize={selectedSize}
                onSizeSelect={handleSizeSelect}
                sizeOptions={product?.size}
            />
            
            <div className='flex items-center justify-between mt-6'>
                <QuantitySelector
                    isLoading={isLoading}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                />
                
                <AddToCartButton
                    isLoading={isLoading}
                    onAddToCart={handleAddToCart}
                    disabled={!selectedSize}
                />
            </div>
        </div>
    );
};

export default ProductOptions; 