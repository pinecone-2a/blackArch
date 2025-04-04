"use client"

import HomeHeader from "./homeHeader";
import Footer from "./homeFooter";
import { Star } from "lucide-react";
import CategoryFilterSide from "./categoryFilterSide";
import { Button } from "@/components/ui/button";
import useFetchData from "@/lib/customHooks/useFetch";
import { useEffect, useState } from "react";
import type { Product } from "../home/page";
import Link from "next/link";
import Reveal from "./Reavel"; 

export default function CategoryComp() {
  const { data, loading } = useFetchData("products");
  const [allProducts, setAllProducts] = useState<Product[]>([])

    useEffect(() => {
        if (Array.isArray(data)) {
          setAllProducts(data); 
        } else {
        }
      }, [data]);
  
  console.log(data);


  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <div className="mt-24 pt-4 pb-16 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 px-6">Shop Collection</h1>
        
        <div className="flex flex-col md:flex-row gap-6 px-4">
          <div className="md:w-1/4 w-full">
            <CategoryFilterSide/>
          </div>
          
          <div className="md:w-3/4 w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl border p-4 flex flex-col items-center h-[300px] shadow-sm">
                    <div className="w-full h-[180px] bg-gray-100 animate-pulse rounded-lg mb-4"></div>
                    <div className="w-3/4 h-5 bg-gray-100 animate-pulse rounded mb-2"></div>
                    <div className="w-1/3 h-6 bg-gray-100 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {allProducts.map((product: any) => (
                  <Link href={`/productDetail/${product.id}`} key={product.id} className="transform transition-transform hover:scale-[1.02]">
                    <div className="group bg-white h-[300px] rounded-xl border shadow-sm p-4 flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out">
                      <div className="w-full h-[180px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="object-contain h-full w-full p-2 transition-transform duration-700 ease-in-out group-hover:scale-110"
                        />
                      </div>
                      <div className="mt-4 w-full text-center">
                        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                        <p className="mt-1 text-lg font-bold text-gray-900">₮{product.price}</p>
                      </div>
                      <div className="absolute bottom-0 w-full">
                        <Button className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out w-full rounded-t-none rounded-b-xl shadow-lg bg-black text-white hover:bg-gray-800">
                          View Product
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}