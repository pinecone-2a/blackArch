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

          <div className="w-full overflow-x-auto">
            <div className="flex gap-6  mt-6 pl-4">


              {newArrival.map((product: any) => (
                <Link key={product.id} href={`/productDetail/${product.id}`}>
                  <div
                    key={product.id}
                    className="flex flex-col min-w-[220px] sm:min-w-[250px] "
                  >

                    <div style={{ backgroundImage: `url(${product.image})` }}
                      className="w-[220px] h-[230px] sm:w-[250px] sm:h-[260px] bg-cover bg-center rounded-xl"></div>
                    <Reavel className="text-base sm:text-lg font-semibold mt-2">
                      {product.name}
                    </Reavel>
                    <div className="flex items-center gap-1 mt-1">
                      <Reavel className="flex gap-1 text-yellow-500">★★★★</Reavel>
                      <Reavel className="text-sm sm:text-base">5/{product.rating}</Reavel>
                    </div>
                    <Reavel className="text-sm sm:text-lg font-bold">₮{product.price}</Reavel>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white h-12 w-full sm:w-[70%] md:w-[50%] border flex items-center justify-center mt-8 cursor-pointer text-lg font-semibold hover:bg-gray-100 transition">
            View all
          </div>
          <div className="w-full bg-[#F0F0F0] flex flex-col items-center mt-14 rounded-2xl p-8">
            <p className="text-[30px] sm:text-[36px] font-semibold text-center">
              ХЭВ ЗАГВАРААР ХАЙХ
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-6">
              {["Casual", "Formal", "Party"].map((style, i) => (
                <div
                  key={i}
                  className="w-full h-[220px] sm:h-[250px] bg-white rounded-2xl bg-[url(/casual.png)] bg-cover bg-center flex items-center pl-8 text-white text-[30px] sm:text-[36px] font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                  {style}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}