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


export type Product = {
  id: string,
  name: string,
  rating:string,
  price:string,
  image:string,
}


export default function HomePage() {
  const user = useContext(UserContext)
  console.log("hereglegch", user)
  const [newArrival, setNewArrival] = useState<Product[]>([])
  const { data, loading } = useFetchData("products/new")
  console.log(data);
  

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



  return (
    <div>
      <HomeHeader />

      <div className="pt-1 bg-[#F2F0F1] flex flex-wrap  2xl:w-[80%] mx-auto justify-between items-end px-6 lg:px-20">


        <div className="w-full lg:w-1/2 flex flex-col flex-grow">
          <h1 className="font-extrabold text-3xl sm:text-6xl mb-10 max-w-[550px]">
            <Reavel>ӨӨРТ ТОХИРСОН</Reavel> <Reavel>ЗАГВАРЫН</Reavel> <Reavel>ХУВЦАСЫГ ОЛООРОЙ</Reavel>
          </h1>

          <p className="max-w-[550px] text-lg text-gray-600">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>

          <div className="mt-10 flex justify-center lg:justify-start ">
            <TransitionLink href="/category">
              <Button className="w-[300px] flex h-[40px] rounded-2xl py-3 text-lg">
                Shop Now
              </Button>
            </TransitionLink>
          </div>



          <div className="my-5 flex flex-wrap gap-10">
            <div className="flex-grow flex flex-col justify-center items-center">
              <h1 className="font-bold text-3xl">200+</h1>
              <p className="text-gray-600">  Олон Улсын Бренд</p>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center">
              <h1 className="font-bold text-3xl">2,000+</h1>
              <p className="text-gray-600">Сайн Чанарын Бүтээгдэхүүн</p>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center">
              <h1 className="font-bold  text-3xl">30,000+</h1>
              <p className="text-gray-600">   Идэвхтэй Үйлчлүүлэгчид</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end flex-grow relative">
          <motion.div
            initial={{ opacity: 0, y: 75 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50 }}
            className="w-full max-w-[500px] mx-auto flex"
          >
            <Image
              width={500}
              height={500}
              src="/Rectangle.png"
              alt="Fashion Banner"


            />
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

          <div className="relative">
 
      <div className="flex overflow-hidden w-full h-full">
        <div
          className="relative flex transition-transform duration-1000"
          style={{
            transform: `rotateY(${currentIndex * -90}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {newArrival.map((product: Product, index) => (
            <div
              key={product.id}
              className="min-w-[220px] sm:min-w-[250px] relative flex flex-col"
              style={{
                transform: `rotateY(${index * 90}deg) translateZ(400px)`,
                backfaceVisibility: 'hidden', 
              }}
            >
              <Link href={`/productDetail/${product.id}`}>
                <div
                  style={{ backgroundImage: `url(${product.image})` }}
                  className="w-[220px] h-[230px] sm:w-[250px] sm:h-[260px] bg-cover bg-center rounded-xl"
                ></div>
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
          ))}
        </div>
      </div>


      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        &#10095;
      </button>
    </div>
          <div className="rounded-2xl bg-white h-12 w-full sm:w-[70%] md:w-[50%] border flex items-center justify-center mt-8 cursor-pointer text-lg font-semibold hover:bg-gray-100 transition">
            View all
          </div>
         
        </div>
      </div>

      <Footer />
    </div>
  );
}