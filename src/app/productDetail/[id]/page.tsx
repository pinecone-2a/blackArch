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
    const user = useContext(UserContext);
    const [ripple, setRipple] = useState(false);
    const [shake, setShake] = useState(false);

<<<<<<< HEAD
    const handleClick = () => {
        setRipple(true);
        setShake(true);
        handleSumbit();

        setTimeout(() => setRipple(false), 600);
        setTimeout(() => setShake(false), 300);
    };



=======
>>>>>>> main
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
        if (user) {
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
            toast.success("Сагсанд амжилттай нэмэгдлээ!");

        }
    }

    return (

        <div className='p-4 max-w-7xl mx-auto'>
            <Header />
            <Toaster position='top-center' />
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
                    <div className='bg-gray-300 rounded-2xl p-2 overflow-hidden '>
                        <img src={product?.image} 
                        alt='Product'
                         className='w-full h-full object-cover transition-all duration-700 ease-in-out hover:rounded-[50%] hover:scale-125' />
                    </div>
                    {/* <div className='grid grid-cols-3 md:grid-cols-6 gap-3 mt-4'>
                        <img src='t-shirt.png' className='w-full bg-gray-300 rounded-xl p-1' />
                        <img src='t-shirt.png' className='w-full bg-gray-300 rounded-xl p-1' />
                        <img src='t-shirt.png' className='w-full bg-gray-300 rounded-xl p-1' />
                    </div> */}

                </div>


                <div>
                    <h1 className='text-5xl font-bold'>{product?.name}</h1>
                    <div className='flex items-center mt-2 text-3xl'>
                        <span className='text-yellow-500'>★★★★☆</span>
                        <span className='ml-2 text-gray-500 text-sm'>4.5/5</span>
                    </div>
                    <div className='flex items-center gap-2 mt-3 text-4xl'>
                        <h2 className='font-bold'>{product?.price}$</h2>
                    </div>
                    <p className='mt-3 text-gray-700 text-xl'>
                        {product?.description}
                    </p>

                    <p className='text-lg font-bold mt-18'>Select Colors</p>
<<<<<<< HEAD
=======
                    <div className='flex gap-2 mt-2'>
                        <button className='w-10 h-10 rounded-full bg-green-700 hover:ring-4 hover:ring-green-500 transition duration-300'
                            onClick={() => handleColorClick('green')}>
                        </button>
>>>>>>> main

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

<<<<<<< HEAD
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
=======
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
            <div id="recommend-container"></div>

        </div>

    );
}

export default ProductDetail;

