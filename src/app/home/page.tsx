"use client";


import TransitionLink from "../_components/TransitionLink";
import { useState, useEffect } from "react";
import useFetchData from "@/lib/customHooks/useFetch";
import Footer from "../_components/homeFooter";
import HomeHeader from "../_components/homeHeader";
import { Star } from "lucide-react";
import Reavel from "../_components/Reavel";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"
import Image from "next/image";
import BrandsBar from "../_components/BrandBar";
import Link from "next/link";
import ProductDetail from "../productDetail/[id]/page";
import { useContext } from "react";
import { UserContext } from "@/lib/userContext";
import breakdance from "./breakdance.json"
import muted1 from "./mute1.json"

import dynamic from "next/dynamic";


const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { Skeleton } from "@/components/ui/skeleton";


export type Product = {
  id: string,
  name: string,
  rating: string,
  price: string,
  image: string,
}


export default function HomePage() {
  const user = useContext(UserContext)
  console.log("hereglegch", user)
  const [newArrival, setNewArrival] = useState<Product[]>([])
  const { data, loading } = useFetchData("products/new")
  console.log(data);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (Array.isArray(data)) {
      setNewArrival(data);
    } else {
    }
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newArrival.length);
  };


  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + newArrival.length) % newArrival.length
    );
  };

  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <div className="sticky inset-0 z-30">  <HomeHeader /> </div>
     

      <div className="py-48 bg-black flex flex-wrap w-full 2xl:w-[100%] mx-auto justify-between items-end px-6 lg:px-20 relative -z-0">
      <video
      src="video2.mp4"
      autoPlay
      loop
      muted={isMuted}
      playsInline
      preload="metadata"
      className="absolute top-0 right-0 w-full h-full object-cover z-0 md:w-[50%]"
    />
   <div className="absolute top-0 left-0 h-full w-[50%] hidden md:block ">
    <img 
      src="street.jpg" 
      className="h-full w-full object-cover z-0" 
      alt="Street fashion"
      width={800}
      height={600}
      loading="eager"
    />
    <div className="absolute top-0 -right-60 w-[550px] h-full bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.9)] to-transparent z-20 pointer-events-none" />
  </div>
   {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-[rgba(185,185,185,0.1)] to-white z-10 pointer-events-none" /> */}
    {mounted && 
    
    <button
        onClick={toggleMute}
        className="absolute top-4 right-4 p-2  text-white rounded-full  w-[50px] h-[50px]"
      >
        {typeof window !== 'undefined' && (!isMuted ? 
  <Lottie animationData={breakdance} style={{ width: 50, height: 50}} className="rounded-full overflow-hidden"/> : 
  <div className="bg-white h-[50px] w-[50px] rounded-full">
    <Lottie animationData={muted1} style={{ width: 50, height: 50, borderRadius:50}} />
  </div>
)}
      </button>
    }




        <div className="w-full lg:w-1/2 flex flex-col flex-grow z-10 relative">
          <h1 className="font-extrabold text-3xl sm:text-6xl mb-10 max-w-[550px] text-white opacity-90">
            <Reavel>ӨӨРТ ТОХИРСОН</Reavel> <Reavel>ЗАГВАРЫН</Reavel> <Reavel>ХУВЦАСЫГ ОЛООРОЙ</Reavel>
          </h1>

          <div className="mt-10 flex justify-center lg:justify-start">
            <TransitionLink href="/category">
              <Button className="w-[300px] flex h-[40px] rounded-2xl py-3 text-lg bg-white text-black  shadow-2xl border hover:text-black xl:mt-[100px]">
                Shop Now
              </Button>
            </TransitionLink>
          </div>


        </div>

        <div className="flex justify-end flex-grow relative">
          <motion.div
            initial={{ opacity: 0, y: 75 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50 }}
            className="w-full max-w-[500px] mx-auto flex"
          >
          </motion.div>
        </div>
      </div>


      <div><BrandsBar /></div>


      <div className="bg-[#ffffff] w-full my-24 flex items-center justify-center">
        <div className="flex flex-col w-full max-w-7xl px-4 items-center">
          <div className="mt-6">
            <p className="text-[#000000] text-[32px] sm:text-6xl font-bold text-center">
              ШИНЭЭР ИРСЭН
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto py-8">
            {/* Simplified carousel - no 3D transforms */}
            <div className="overflow-hidden">
              <div className="flex gap-6">
                {loading ? (
                  // Skeleton loading for products
                  Array(4).fill(0).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="min-w-[220px] sm:min-w-[250px] flex-shrink-0 flex flex-col"
                    >
                      <Skeleton className="w-[220px] h-[230px] sm:w-[250px] sm:h-[260px] rounded-xl" />
                      <Skeleton className="h-6 w-3/4 mt-2" />
                      <Skeleton className="h-4 w-1/2 mt-1" />
                      <Skeleton className="h-5 w-1/4 mt-1" />
                    </div>
                  ))
                ) : (
                  <>
                
                    {newArrival.map((product: Product, index) => {
                  
                      if (Math.abs(index - currentIndex) > 1 && 
                          !(index === newArrival.length - 1 && currentIndex === 0) && 
                          !(index === 0 && currentIndex === newArrival.length - 1)) {
                        return null;
                      }
                      
                      return (
                        <div
                          key={product.id}
                          className={`min-w-[220px] sm:min-w-[250px] flex-shrink-0 flex flex-col transition-opacity duration-300 
                                     ${index === currentIndex ? 'opacity-100' : 'opacity-50'}`}
                        >
                          <Link href={`/productDetail/${product.id}`}>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              width={250}
                              height={260}
                              className="w-[220px] h-[230px] sm:w-[250px] sm:h-[260px] rounded-xl object-cover"
                              loading={index === currentIndex ? "eager" : "lazy"}
                            />
                          </Link>
                          <div className="text-base sm:text-lg font-semibold mt-2">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex gap-1 text-yellow-500">★★★★</div>
                            <div className="text-sm sm:text-base">5/{product.rating}</div>
                          </div>
                          <div className="text-sm sm:text-lg font-bold">₮{product.price}</div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {!loading && (
              <>
                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full shadow-lg"
                  onClick={prevSlide}
                  aria-label="Previous product"
                >
                  &#10094;
                </button>
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full shadow-lg"
                  onClick={nextSlide}
                  aria-label="Next product"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>
          <div className="rounded-2xl bg-white h-12 w-full sm:w-[70%] md:w-[50%] border flex items-center justify-center mt-8 cursor-pointer text-lg font-semibold hover:bg-gray-100 transition">
            {loading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              "View all"
            )}
          </div>



        

        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-5 p-10 bg-white mt-20 mb-20">
    
    <div className="relative h-[800px]">
      <img
        src="/zurag4.jpeg"
        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
      />
    </div>

 
    <div className="grid grid-rows-3 gap-3 h-[1200px]">
      <div className="relative">
        <img
          src="/street2.jpg"
          className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
        />
      </div>
   
      <div className="relative">
        <img
          src="/zurag2.jpeg"
          className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>


    <div className="relative h-[800px]">
      <img
        src="/zurag3.jpeg"
        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
      />
    </div>
  </div>

      <Footer/>
    </div>
  );
}
