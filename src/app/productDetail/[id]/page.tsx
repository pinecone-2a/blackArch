"use client";
import { FC, useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import useFetchData from "@/lib/customHooks/useFetch";
import HomeHeader from "@/app/_components/homeHeader";
import HomeFooter from "@/app/_components/homeFooter";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
    const { id } = params;
    const { data, loading } = useFetchData<Product>(`products/${id}`);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

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
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex lg:flex-col gap-4 items-center">
                            <img src={data?.image} className="w-32 h-32 bg-gray-300 rounded-xl cursor-pointer" />
                            <img src={data?.image} className="w-32 h-32 bg-gray-300 rounded-xl cursor-pointer" />
                            <img src={data?.image} className="w-32 h-32 bg-gray-300 rounded-xl cursor-pointer" />
                        </div>
                        <div className="bg-gray-300 rounded-2xl max-w-[600px] mx-auto">
                            <img src={data?.image} alt="Product" className="w-full rounded-xl" />
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-5xl font-bold">{data?.name}</h1>
                    <div className="flex items-center mt-2 text-3xl">
                        <span className="text-yellow-500">★★★★☆</span>
                        <span className="ml-2 text-gray-500 text-sm">{data?.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-4xl">
                        <h2 className="font-bold">${data?.price}</h2>
                    </div>
                    <p className="mt-3 text-gray-700 text-xl">{data?.description}</p>

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
                        <Button className="bg-black text-white p-3 rounded-full ml-auto">Add to Cart</Button>
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
            <HomeFooter />
        </div>
    );
};

export default ProductDetail;