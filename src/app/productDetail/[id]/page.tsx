<<<<<<< HEAD
"use client";
import { FC, useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import useFetchData from "@/lib/customHooks/useFetch";
import HomeHeader from "@/app/_components/homeHeader";
import HomeFooter from "@/app/_components/homeFooter";
=======
"use client"
import React from 'react';
import Footer from '@/app/_components/homeFooter';
>>>>>>> main
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
<<<<<<< HEAD
=======
import axios from 'axios';
import { useState, useEffect } from 'react';
import  Header from '@/app/_components/homeHeader';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {FC} from 'react';
import {use} from "react"
import { useContext } from "react";
import { UserContext } from "@/lib/userContext";
import { InstantSearch } from 'react-instantsearch';
import { LookingSimilar } from 'react-instantsearch';
>>>>>>> main

type ProductDetailProps = {
    params: { id: string };
};

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    size: string[];
    color: string;
    category: string;
    rating: string;
    description: string;
};

const ProductDetail: FC<ProductDetailProps> = ({ params }) => {
<<<<<<< HEAD
    const { id } = params;
    const { data, loading } = useFetchData<Product>(`products/${id}`);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

=======

    const {id} = use(params)
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const user = useContext(UserContext)

// const fetchRecommendations = async() => {
    // const client = algoliasearch('YUWLMDFM73', '759f34eb01934535c841f508bc5ffb72').initRecommend();
    //   const response = await client.getRecommendRule({
    //     indexName: 'products',
    //     model: 'looking-similiar',
    //     objectID: '67dd209dfea4218b14f3f96f',
    //   });
    //     console.log(response);
    // }
      
    // fetchRecommendations()

    // const searchClient = algoliasearch('YUWLMDFM73', '759f34eb01934535c841f508bc5ffb72');

    // const search = InstantSearch({
    //   searchClient,
    //   indexName: 'products',
    // }).addWidgets([
    //   LookingSimilar({
    //     container: '#recommend-container',
    //     objectIDs: ['f3ed406e94945_dashboard_generated_id'],
    //   }),
    // ]);
    
    // search.start();
    
 


    //   const fetchRecommendations = async (id: string) => {
    //     const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
    //     const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;
    
    //     if (!appId || !apiKey) {
    //         console.error("Algolia API credentials are missing.");
    //         return;
    //     }
    
    //     const recommendClient = recommend(appId, apiKey);
    
    //     try {
    //         const response = await recommendClient.getRecommendations({
    //             requests: [{ indexName: 'products', objectID: id, model: 'looking-similar' }]
    //         });
    
    //         console.log(response);
    //     } catch (error) {
    //         console.error("Error fetching recommendations:", error);
    //     }
    // };


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
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/id?id=${id}`) // API URL
            .then(response => {
                setProduct(response.data.product);
            })
            .catch(error => console.error("Error:", error));
    }, []);




    const handleAddToCart = () => {
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}products/id?id=${id}`, { // API URL &  ADD CART
            productId: product?.id,
            size: selectedSize,
            quantity: quantity,
        }).then(response => {
            alert("Сагсанд амжилттай нэмэгдлээ!");
        }).catch(error => console.error("Error:", error));
    };
    
const handleSumbit = () => {
    if(user) {
        handleAddToCart()
    } else {
      
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
            alert("Сагсанд амжилттай нэмэгдлээ!");

        }
    }
  
>>>>>>> main
    return (
        <div className="p-4 max-w-7xl mx-auto">
            <HomeHeader />
            <Breadcrumb>
                <BreadcrumbList className="text-2xl mt-6">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/category">Shop</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>T-Shirt</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div>
<<<<<<< HEAD
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex lg:flex-col gap-4 items-center">
                            <img src={data?.image} className="w-32 h-32 bg-gray-300 rounded-xl cursor-pointer" />
                            <img src={data?.image} className="w-32 h-32 bg-gray-300 rounded-xl cursor-pointer" />
                            <img src={data?.image} className="w-32 h-32 bg-gray-300 rounded-xl cursor-pointer" />
                        </div>
                        <div className="bg-gray-300 rounded-2xl max-w-[600px] mx-auto">
                            <img src={data?.image} alt="Product" className="w-full rounded-xl" />
                        </div>
=======
                    <div className='bg-gray-300 rounded-2xl p-2'>
                        <img src={product?.image} alt='Product' className='w-full rounded-xl' />
>>>>>>> main
                    </div>
                </div>

                <div>
<<<<<<< HEAD
                    <h1 className="text-5xl font-bold">{data?.name}</h1>
                    <div className="flex items-center mt-2 text-3xl">
                        <span className="text-yellow-500">★★★★☆</span>
                        <span className="ml-2 text-gray-500 text-sm">{data?.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-4xl">
                        <h2 className="font-bold">${data?.price}</h2>
                    </div>
                    <p className="mt-3 text-gray-700 text-xl">{data?.description}</p>
=======
                    <h1 className='text-5xl font-bold'>{product?.name}</h1>
                    <div className='flex items-center mt-2 text-3xl'>
                        <span className='text-yellow-500'>★★★★☆</span>
                        <span className='ml-2 text-gray-500 text-sm'>4.5/5</span>
                    </div>
                    <div className='flex items-center gap-2 mt-3 text-4xl'>
                        <h2 className='font-bold'>{product?.price}</h2>
                        <h2 className='text-gray-400 line-through'>$300</h2>
                        <h2 className='text-red-500 font-semibold'>-40%</h2>
                    </div>
                    <p className='mt-3 text-gray-700 text-xl'>
                    {product?.description}
                    </p>
>>>>>>> main

                    <p className="text-lg font-bold mt-4 text-end">Select Colors</p>
                    <div className="flex gap-2 mt-2">
                        {["green", "gray", "red", "blue"].map((color) => (
                            <button
                                key={color}
                                style={{ backgroundColor: color }}
                                className={`w-10 h-10 rounded-full ${
                                    selectedColor === color ? "border-4 border-black ring-4 ring-gray-400" : ""
                                }`}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>

<<<<<<< HEAD
                    <p className="text-lg font-bold mt-4">Choose Size</p>
                    <div className="flex gap-5 mt-2">
                        {["Small", "Medium", "Large", "X-Large"].map((size) => (
                            <button
                                key={size}
                                className={`px-4 py-2 border rounded-lg ${selectedSize === size ? "bg-black text-white" : ""}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
=======
                    <p className='text-lg font-bold mt-4 text-end'>Choose Size</p>

                    <div className='flex gap-5 mt-2 rounded-full'>
                    <button className={`px-4 py-2 border rounded-lg hover:bg-gray-200 transition duration-300 ${selectedSize === 'Small' ? 'border-[#FF474C]' : ''}`}
                            onClick={() => handleSizeClick('Small')}>Small</button>
                        <button className={`px-4 py-2 border rounded-lg hover:bg-gray-200 transition duration-300 ${selectedSize === 'Medium' ? 'border-[#FF474C]' : ''}`}
                            onClick={() => handleSizeClick('Medium')}>Medium</button>
                        <button className={`px-4 py-2 border rounded-lg hover:bg-gray-200 transition duration-300 ${selectedSize === 'Large' ? 'border-[#FF474C]' : ''}`}
                            onClick={() => handleSizeClick('Large')}>Large</button>
                        <button className={`px-4 py-2 border rounded-lg hover:bg-gray-200 transition duration-300 ${selectedSize === 'X-Large' ? 'border-[#FF474C]' : ''}`}
                            onClick={() => handleSizeClick('X-Large')}>X-Large</button>
>>>>>>> main
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                            onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                        >
                            -
                        </button>
                        <span className="text-lg font-semibold">{quantity}</span>
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-lg"
                            onClick={() => setQuantity((q) => q + 1)}
                        >
                            +
                        </button>
<<<<<<< HEAD
                        <Button className="bg-black text-white p-3 rounded-full ml-auto">Add to Cart</Button>
=======
                        <button
                            className='bg-black text-white p-3 rounded-full ml-auto'
                            onClick={handleSumbit}
                        >
                            Add to Cart
                        </button>
>>>>>>> main
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-center mt-10">YOU MIGHT ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <img src="t-shirt.png" className="w-full rounded-lg" />
                    <h3 className="text-lg font-semibold mt-4">Polo with Contrast Trims</h3>
                    <div className="flex items-center mt-2">
                        <span className="text-yellow-500">★★★★☆</span>
                        <span className="ml-2 text-gray-500 text-sm">4.0/5</span>
                    </div>
                    <div className="flex items-center mt-2">
                        <span className="text-xl font-bold">$212</span>
                        <span className="ml-2 line-through text-gray-400">$242</span>
                        <span className="ml-2 text-red-500">-20%</span>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <img src="t-shirt.png" className="w-full rounded-lg" />
                    <h3 className="text-lg font-semibold mt-4">Gradient Graphic T-shirt</h3>
                    <div className="flex items-center mt-2">
                        <span className="text-yellow-500">★★★☆☆</span>
                        <span className="ml-2 text-gray-500 text-sm">3.5/5</span>
                    </div>
                    <div className="mt-2 text-xl font-bold">$145</div>
                </div>
            </div>
<<<<<<< HEAD
            <HomeFooter />
=======
            <div className='pt-10'>
                <Footer />
            </div>
            <div id="recommend-container"></div>

>>>>>>> main
        </div>
        
    );
};

export default ProductDetail;
