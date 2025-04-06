"use client"
import React from 'react';
import Footer from '@/app/_components/homeFooter';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '@/app/_components/homeHeader';
import { Skeleton } from "@/components/ui/skeleton";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { FC } from 'react';
import { use } from "react"
import { useContext } from "react";
import { UserContext } from "@/lib/userContext";
import { InstantSearch } from 'react-instantsearch';
import { LookingSimilar } from 'react-instantsearch';
import { toast, Toaster } from 'sonner';

import { Check } from 'lucide-react';


type ProductDetailProps = {
    params: Promise<{ id: string }>;
}

type Product = {
    id: string,
    name: string,
    price: number,
    discount: number,
    rating: number,
    image: string,
    colors: string[],
    sizes: string[],
    description: string
}

const ProductDetail: FC<ProductDetailProps> = ({ params }) => {

    const { id } = use(params)
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [ripple, setRipple] = useState(false);
    const [shake, setShake] = useState(false);

    const handleClick = () => {
        setRipple(true);
        setShake(true);
        handleSumbit();

        setTimeout(() => setRipple(false), 600);
        setTimeout(() => setShake(false), 300);
    };


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


    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        axios.get(`/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    }, [id]);
    console.log(product);





    const handleSumbit = () => {
      

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push({
                productId: product?.id,
                size: selectedSize,
                quantity: quantity,
                image: product?.image,
                name: product?.name,
                price: product?.price,
                description: product?.description

            });
            localStorage.setItem("cart", JSON.stringify(cart));
            toast.success("Сагсанд амжилттай нэмэгдлээ!");

        
    }

    return (
        <div className='p-4 max-w-7xl mx-auto'>
            <div>
                <Header />
            </div>

            <Toaster position='top-center'/>
            <div className="mt-28 pt-8">
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
                            <BreadcrumbPage className='text-black' >
                                {isLoading ? (
                                    <Skeleton className="h-6 w-20" />
                                ) : product?.name || 't-Shirt'}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6'>
                <div>
                    {isLoading ? (
                        <Skeleton className="w-full h-96 rounded-2xl" />
                    ) : (
                        <div className='rounded-2xl p-2 overflow-hidden'>
                            <img 
                                src={product?.image} 
                                alt='Product'
                                className='w-full h-full object-cover transition-all duration-700 ease-in-out hover:rounded-[50%] hover:scale-125' 
                            />
                        </div>
                    )}
                </div>

                <div>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-12 w-3/4 mb-4" />
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-10 w-28 mb-4" />
                            <Skeleton className="h-24 w-full mb-6" />
                            <Skeleton className="h-6 w-36 mb-3" />
                            <div className="flex gap-2 mb-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <Skeleton key={i} className="w-10 h-10 rounded-full" />
                                ))}
                            </div>
                            <Skeleton className="h-6 w-36 mb-3" />
                            <div className="flex gap-5 mb-6">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="w-24 h-10 rounded-lg" />
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-10 h-10 rounded-lg" />
                                <Skeleton className="w-6 h-6" />
                                <Skeleton className="w-10 h-10 rounded-lg" />
                                <Skeleton className="w-36 h-12 rounded-full ml-auto" />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className='text-5xl font-bold'>{product?.name}</h1>
                            <div className='flex items-center mt-2 text-3xl'>
                                <span className='text-yellow-500'>★★★★☆</span>
                                <span className='ml-2 text-gray-500 text-sm'>4.5/5</span>
                            </div>
                            <div className='flex items-center gap-2 mt-3 text-4xl'>
                                <h2 className='font-bold'>{product?.price}₮</h2>
                            </div>
                            <p className='mt-3 text-gray-700 text-xl'>
                                {product?.description}
                            </p>

                            <p className='text-lg font-bold mt-18'>Select Colors</p>

                            <div className='flex gap-2 mt-2 '>
                                {[
                                    { color: 'green', bgColor: 'bg-green-700', ringColor: 'hover:ring-green-500' },
                                    { color: 'black', bgColor: 'bg-black', ringColor: 'hover:ring-gray-500' },
                                    { color: 'gray', bgColor: 'bg-gray-700', ringColor: 'hover:ring-gray-400' },
                                    { color: 'red', bgColor: 'bg-red-700', ringColor: 'hover:ring-red-500' },
                                    { color: 'pink', bgColor: 'bg-pink-400', ringColor: 'hover:ring-pink-500' },
                                    { color: 'blue', bgColor: 'bg-blue-700', ringColor: 'hover:ring-blue-500' }
                                ].map(({ color, bgColor, ringColor }) => (
                                    <button
                                        key={color}
                                        className={`relative w-10 h-10 rounded-full ${bgColor} ${ringColor} hover:ring-4 transition duration-300 flex items-center justify-center cursor-grab`}
                                        onClick={() => handleColorClick(color)}
                                    >
                                        {selectedColor === color && (
                                            <Check className="text-white" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <p className='text-lg font-bold mt-18'>Choose Size</p>

                            <div className='flex gap-5 mt-2'>
                                {['Small', 'Medium', 'Large', 'X-Large'].map((size) => (
                                    <button
                                        key={size}
                                        className={`px-4 py-2 border rounded-lg transition-all duration-300 ease-out cursor-grab
                                hover:bg-gray-200 hover:text-black transform
                                active:scale-90 
                                ${selectedSize === size ? 'bg-black text-white shadow-md scale-105' : ''}`}
                                        onClick={() => handleSizeClick(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>


                            <div className='flex items-center gap-4 mt-6'>
                                <button
                                    className='px-4 py-2 bg-gray-200 rounded-lg transition-all duration-300 cursor-grab
                                    hover:bg-gray-300 active:scale-90'
                                    onClick={() => handleQuantityChange('decrease')}
                                >
                                    -
                                </button>

                                <span className='text-lg font-semibold'>{quantity}</span>

                                <button
                                    className='px-4 py-2 bg-gray-200 rounded-lg transition-all duration-300 cursor-grab
                                    hover:bg-gray-300 active:scale-90'
                                    onClick={() => handleQuantityChange('increase')}
                                >
                                    +
                                </button>

                                <button
                                    className={`relative bg-black text-white p-3 rounded-full ml-auto cursor-grab
                                    transition-all duration-300 ease-in-out 
                                    hover:bg-gray-900 hover:scale-110 hover:shadow-lg 
                                    active:scale-95 active:bg-gray-800 
                                    ${shake ? 'animate-shake' : ''}`}
                                    onClick={handleClick}
                                >
                                    Add to Cart
                                    {ripple && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="w-20 h-20 bg-white opacity-30 rounded-full animate-ping"></span>
                                        </span>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <h2 className='text-2xl font-bold text-center mt-10'>YOU MIGHT ALSO LIKE</h2>
            <div className="w-full overflow-x-auto">
                <div className="flex gap-6 mt-6 pl-4">
                    {isLoading ? (
                        
                        [1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex flex-col min-w-[220px] sm:min-w-[250px]">
                                <Skeleton className="w-[220px] h-[230px] sm:w-[250px] sm:h-[260px] rounded-xl" />
                                <Skeleton className="h-5 w-3/4 mt-2" />
                                <Skeleton className="h-4 w-1/2 mt-1" />
                                <Skeleton className="h-4 w-1/4 mt-1" />
                            </div>
                        ))
                    ) : (
                        
                        [1, 2, 3, 4, 5].map((_, i) => (
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
                        ))
                    )}
                </div>
            </div>
            <div className='mt-24 pt-16 mb-10'>
                <Footer />
            </div>
            <div id="recommend-container"></div>
        </div>
    );
}

export default ProductDetail;
