"use client"
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '../_components/homeFooter';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { useState } from 'react';


export default function ProductDetail() {

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleColorClick = (color: any) => {
        setSelectedColor(color);
        console.log(`Selected color: ${color}`);
    };

    const handleSizeClick = (size: any) => {
        setSelectedSize(size);
        console.log(`Selected size: ${size}`);
    };

    const handleQuantityChange = (type: any) => {
        if (type === 'increase') {
            setQuantity(quantity + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        console.log(`Added to cart: Size: ${selectedSize}, Quantity: ${quantity}`);
    };

    return (
        <div className='p-4 max-w-7xl mx-auto'>

            <Breadcrumb>
                <BreadcrumbList className='text-2xl flex text-gray-300 items-center'>
                    <BreadcrumbItem>
                        <BreadcrumbLink className='hover:underline' href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink className='hover:underline' href="/category">Shop</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className='text-black' >t-Shirt</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>


            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6'>

                <div>
                    <div className='bg-gray-300 rounded-2xl p-2'>
                        <img src='t-shirt.png' alt='Product' className='w-full rounded-xl' />
                    </div>
                    <div className='grid grid-cols-3 md:grid-cols-6 gap-3 mt-4'>
                        <img src='t-shirt.png' className='w-full bg-gray-300 rounded-xl p-1' />
                        <img src='t-shirt.png' className='w-full bg-gray-300 rounded-xl p-1' />
                        <img src='t-shirt.png' className='w-full bg-gray-300 rounded-xl p-1' />
                    </div>

                </div>


                <div>
                    <h1 className='text-5xl font-bold'>ONE LIFE GRAPHIC T-SHIRT</h1>
                    <div className='flex items-center mt-2 text-3xl'>
                        <span className='text-yellow-500'>★★★★☆</span>
                        <span className='ml-2 text-gray-500 text-sm'>4.5/5</span>
                    </div>
                    <div className='flex items-center gap-2 mt-3 text-4xl'>
                        <h2 className='font-bold'>$260</h2>
                        <h2 className='text-gray-400 line-through'>$300</h2>
                        <h2 className='text-red-500 font-semibold'>-40%</h2>
                    </div>
                    <p className='mt-3 text-gray-700 text-xl'>
                        This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric,
                        it offers superior comfort and style.
                    </p>

                    <p className='text-lg font-bold mt-4 text-end'>Select Colors</p>
                    <div className='flex gap-2 mt-2'>
                        <button className='w-10 h-10 rounded-full bg-green-700 hover:ring-4 hover:ring-green-500 transition duration-300'
                            onClick={() => handleColorClick('green')}>
                        </button>

                        <button className='w-10 h-10 rounded-full bg-black hover:ring-4 hover:ring-gray-500 transition duration-300'
                            onClick={() => handleColorClick('black')}>
                        </button>

                        <button className='w-10 h-10 rounded-full bg-gray-700 hover:ring-4 hover:ring-gray-400 transition duration-300'
                            onClick={() => handleColorClick('gray')}>
                        </button>
                        <button className='w-10 h-10 rounded-full bg-red-700 hover:ring-4 hover:ring-red-500 transition duration-300'
                            onClick={() => handleColorClick('red')}>
                        </button>
                        <button className='w-10 h-10 rounded-full bg-pink-400 hover:ring-4 hover:ring-pink-500 transition duration-300'
                            onClick={() => handleColorClick('pink')}>
                        </button>
                        <button className='w-10 h-10 rounded-full bg-blue-700 hover:ring-4 hover:ring-blue-500 transition duration-300'
                            onClick={() => handleColorClick('blue')}>
                        </button>
                    </div>

                    <p className='text-lg font-bold mt-4 text-end'>Choose Size</p>

                    <div className='flex gap-5 mt-2 rounded-full'>
                        <button className='px-4 py-2 border rounded-lg hover:bg-gray-200 transition duration-300'
                            onClick={() => handleSizeClick('Small')}>Small</button>
                        <button className='px-4 py-2 border rounded-lg hover:bg-gray-200 transition duration-300'
                            onClick={() => handleSizeClick('Medium')}>Medium</button>
                        <button className='px-4 py-2 border rounded-lg  hover:bg-gray-200 transition duration-300'
                            onClick={() => handleSizeClick('Large')}>Large</button>
                        <button className='px-4 py-2 border rounded-lg hover:bg-gray-200 transition duration-300'
                            onClick={() => handleSizeClick('X-Large')}>X-Large</button>
                    </div>


                    <div className='flex items-center gap-4 mt-6'>
                        <button
                            className='px-4 py-2 bg-gray-200 rounded-lg'
                            onClick={() => handleQuantityChange('decrease')}
                        >
                            -
                        </button>
                        <span className='text-lg font-semibold'>{quantity}</span>
                        <button
                            className='px-4 py-2 bg-gray-200 rounded-lg'
                            onClick={() => handleQuantityChange('increase')}
                        >
                            +
                        </button>
                        <button
                            className='bg-black text-white p-3 rounded-full ml-auto'
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <h2 className='text-2xl font-bold text-center mt-10'>YOU MIGHT ALSO LIKE</h2>
            <div className="w-full overflow-x-auto">
                <div className="flex gap-6  mt-6 pl-4">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col min-w-[220px] sm:min-w-[250px]"
                        >
                            <div className="w-[220px] h-[230px] sm:w-[250px] sm:h-[260px] bg-[url(/podolk.png)] bg-cover bg-center rounded-xl"></div>
                            <p className="text-base sm:text-lg font-semibold mt-2">
                                T-shirt with Tape Details
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="flex gap-1 text-yellow-500">★★★★☆</div>
                                <div className="text-sm sm:text-base">4/5</div>
                            </div>
                            <div className="text-sm sm:text-lg font-bold">$10</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='pt-10'>
                <Footer />
            </div>
        </div>
    );
}
