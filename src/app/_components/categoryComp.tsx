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
      <div className="flex items-start flex-col md:flex-row p-4 2xl:mx-20 xl:mx-0 lg:mx-0 md:mx-0 sm:mx-0">
     <CategoryFilterSide/>
      
        <div className="flex flex-wrap justify-center md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 2xl:mx-20 xl:mx-0s lg:mx-0 md:mx-0 sm:mx-0 gap-10 p-4 w-full">

        { allProducts.map((product: any) => (
          <Link href={`/productDetail/${product.id}`} key={product.id}>  
          <div key={product.id} className="group bg-white w-[300px] h-[250px]  rounded-xl border  p-3 flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out hover:h-[300px]">
            <img src={product.image} width={130} height={130} alt="T-shirt" />
            <Reveal className="mt-5 text-center font-semibold text-gray-800">
            {product.name}
            </Reveal>
            <Reveal className="my-1 text-lg font-bold text-gray-700">{product.price}</Reveal>
            <div className="absolute bottom-0 w-full flex justify-center">
              <Button className="opacity-0 text-lg translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out w-full h-[50px] rounded-bl-xl rounded-br-xl !rounded-t-none">
                Add to Cart
              </Button>
            </div>
          </div>
          </Link>
              ))   }


        </div>
      </div>
      <Footer />
    </div>
  );
}
