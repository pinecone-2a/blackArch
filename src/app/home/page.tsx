"use client";

import TransitionLink from "../_components/TransitionLink";
import { useState, useEffect } from "react";
import useFetchData from "@/lib/customHooks/useFetch";
import Footer from "../_components/homeFooter";
import HomeHeader from "../_components/homeHeader";
import { Star } from "lucide-react";
import Reavel from "../_components/Reavel";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import BrandsBar from "../_components/BrandBar";
import Link from "next/link";
import ProductDetail from "../productDetail/[id]/page";
import { useContext } from "react";
import { UserContext } from "@/lib/userContext";
import breakdance from "./breakdance.json";
import muted1 from "./mute1.json";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { Skeleton } from "@/components/ui/skeleton";

export type Product = {
  id: string;
  name: string;
  rating: string;
  price: string;
  image: string;
};

export default function HomePage() {
  const user = useContext(UserContext);
  console.log("hereglegch", user);
  const [newArrival, setNewArrival] = useState<Product[]>([]);
  const { data, loading, error } = useFetchData("products/new");
  console.log("New arrivals data:", data);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setNewArrival(data);
    } else if (data && typeof data === 'object' && 'message' in data && Array.isArray(data.message)) {
      setNewArrival(data.message);
    } else {
      console.log("No new arrival products found or unexpected data format", data);
  
    }
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () => {
    if (newArrival.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newArrival.length);
  };

  const prevSlide = () => {
    if (newArrival.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newArrival.length) % newArrival.length);
  };

  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <div className="sticky inset-0 z-30">
        {" "}
        <HomeHeader />{" "}
      </div>

      <div className="py-48 bg-black flex flex-wrap w-full 2xl:w-[100%] mx-auto justify-between items-end px-6 lg:px-20 relative -z-0">
        <video
          src="video2.mp4"
          autoPlay
          loop
          muted={isMuted}
          className="absolute top-0 right-0 w-full h-full object-cover z-0 md:w-[50%] "
        />
        <div className="absolute top-0 left-0 h-full w-[50%] hidden md:block ">
          <img src="street.jpg" className="h-full w-full object-cover z-0" />
          <div className="absolute top-0 -right-60 w-[550px] h-full bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.9)] to-transparent z-20 pointer-events-none" />
        </div>
        {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-[rgba(185,185,185,0.1)] to-white z-10 pointer-events-none" /> */}
        {mounted && (
          <button
            onClick={toggleMute}

            
            className="absolute top-4 right-4 p-2 text-white rounded-full w-[50px] h-[50px]"

            
          >
            {typeof window !== "undefined" &&
              (!isMuted ? (
                <Lottie
                  animationData={breakdance}
                  style={{ width: 50, height: 50 }}
                  className="rounded-full overflow-hidden"
                />
              ) : (
                <div className="bg-white h-[50px] w-[50px] rounded-full">
                  <Lottie
                    animationData={muted1}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                  />
                </div>
              ))}
          </button>
        )}

        <div className="w-full lg:w-1/2 flex flex-col flex-grow z-10 relative">
          <h1 className="font-extrabold text-3xl sm:text-6xl mb-10 max-w-[550px] text-white opacity-90">
            <Reavel>ӨӨРТ ТОХИРСОН</Reavel> <Reavel>ЗАГВАРЫН</Reavel>{" "}
            <Reavel>ХУВЦАСЫГ ОЛООРОЙ</Reavel>
          </h1>

          <div className="mt-10 flex justify-center lg:justify-start">
            <TransitionLink href="/category">
              <Button className="w-[300px] flex h-[40px] rounded-2xl relative py-3 text-lg bg-white text-black shadow-[0_10px_20px_-8px_rgba(0,0,0,.7)] transition-all border hover:px-6 hover:pl-2 hover:pr-6 cursor-pointer">
                Худалдаж авах
                <span className="absolute top-[14px] right-[-20px] opacity-0 transition-all duration-500 text-red-500 group-hover:opacity-100 group-hover:right-2">»</span>
              </Button>
            </TransitionLink>
          </div>
        </div>

        <div className="flex justify-end flex-grow relative">
          <motion.div
            initial={{ opacity: 0, y: 75 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="w-full max-w-[500px] mx-auto flex"
          ></motion.div>
        </div>
      </div>

      <div>
        <BrandsBar />
      </div>

      <div className="bg-[#ffffff] w-full my-24 flex items-center justify-center">
        <div className="flex flex-col w-full max-w-7xl px-4 items-center">
          <div className="mt-6 mb-10">
            <p className="text-[#000000] text-[32px] sm:text-6xl font-bold text-center">
              ШИНЭЭР ИРСЭН
            </p>
          </div>

          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="group bg-white h-[320px] rounded-xl border shadow-sm p-3 flex flex-col items-center relative overflow-hidden"
                  >
                    <div className="w-full h-[200px] bg-gray-100 animate-pulse rounded-lg mb-3"></div>
                    <div className="w-3/4 h-6 bg-gray-100 animate-pulse rounded mb-2"></div>
                    <div className="w-1/2 h-7 bg-gray-100 animate-pulse rounded"></div>
                    <div className="absolute bottom-0 w-full">
                      <div className="w-full h-10 bg-gray-100 animate-pulse rounded-b-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newArrival.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 p-4">
                {newArrival.slice(0, 5).map((product: Product) => (
                  <Link
                    href={`/productDetail/${product.id}`}
                    key={product.id}
                    className="transform transition-transform hover:scale-[1.03]"
                  >
                    <div className="group bg-gray-50 h-[320px] rounded-xl border shadow-sm p-3 flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out">
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
                          Шинэ
                        </div>

                        
                      </div>
                      <div className="w-full h-[200px] flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-contain h-full w-full p-2 transition-transform duration-700 ease-in-out group-hover:scale-110"
                        />
                      </div>
                      <div className="mt-3 w-full text-center">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base lg:text-lg truncate">

                          
                          {product.name}
                        </h3>
                        <p className="mt-2 text-lg md:text-xl font-bold text-gray-900">
                          ₮{Number(product.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="absolute bottom-0 w-full">
                        <Button className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out w-full rounded-t-none rounded-b-xl h-10 shadow-lg bg-black text-white hover:bg-gray-800">
                          Дэлгэрэнгүй
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center p-4">
                <p className="mb-2">Одоогоор шинэ бүтээгдэхүүн байхгүй байна</p>
                <Link href="/category" className="text-black underline">
                  Бүх бүтээгдэхүүн харах
                </Link>
              </div>
            )}
          </div>
          
          <Link href="/category" className="mt-8">
            <Button className="bg-white text-black border border-black px-8 py-6 rounded-xl hover:bg-gray-100 transition-colors">
              Бүх бүтээгдэхүүн харах
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-[80%] mx-auto overflow-x-auto flex gap-4 my-20 px-4 sm:justify-between sm:overflow-visible">
        {[
          { src: "/model01.jpg", label: "Өмд & Шорт" },
          { src: "/model002.jpg", label: "Свитер & Малгайтай цамц" },
          { src: "/model03.jpg", label: "Гадуур хувцас" },
          { src: "/model04.jpg", label: "Футболка & Майк" },
        ].map((model, index) => (
          <div
            key={index}
            className="relative min-w-[250px] sm:min-w-0 sm:w-[22%] h-auto group"
          >
            <Image
              src={model.src}
              alt={`model-${index}`}
              width={400}
              height={800}
              className="rounded-xl object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
              <Button className="bg-white text-black rounded-full px-6 py-2 text-sm">
                {model.label}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
