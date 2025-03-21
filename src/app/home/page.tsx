"use client";

import { useState, useEffect } from "react";
import useFetchData from "@/lib/customHooks/useFetch";
import Footer from "../_components/homeFooter";
import HomeHeader from "../_components/homeHeader";
import { Star } from "lucide-react";

type Product = {
  id: string,
  name:string,
  
  
}

export default function HomePage() {

  const [newArrival, setNewArrival] = useState<Product[]>([])
  const {data, loading} = useFetchData("products/new")
  console.log(data)

  useEffect(() => {
    if (Array.isArray(data)) {
      setNewArrival(data); 
    } else {
      console.error("Fetched data is not an array or is undefined");
    }
  }, [data]);
  

  return (
    <div>
      <HomeHeader />
      <main className="bg-[#F2F0F1] flex flex-col pt-6 pb-1 items-center  md:flex md:flex-row ">
        <div className="flex flex-col items-center md:w-[50%]">
          <div className="w-[90%]">
            <p className="text-[#000000] text-[24px] font-bold sm:text-[48px] lg:text-[58px] ">
              ӨӨРТ ТОХИРСОН ХЭВ ЗАГВАРЫН ХУВЦАСЫГ ОЛООРОЙ
            </p>
          </div>
          <div className="w-[90%]">
            <p className="text-[#000000bf] text-[13px] mt-4 sm:text-[16px] lg:text-[18px]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
              
            </p>
          </div>
          <div className="w-[90%] bg-[#000000] rounded-[62px] h-[40px] flex items-center justify-center mt-6  sm:w-[300px] ">
            <p className="text-[#ffffff]">Shop now</p>
          </div>
          <div className="w-[70%] flex justify-between mt-4 items-center">
            <div>
              <p className="text-[22px] sm:text-4xl lg:text-5xl">200+</p>
              <p className="text-[10px] sm:text-[12px] lg:text-[18px] text-[#00000099]">
                Олон Улсын Бренд
              </p>
            </div>
            <div className="h-12 w-[2px] bg-[#000000] opacity-[10%] md:bg-muted "></div>
            <div>
              <p className="text-[22px] sm:text-4xl lg:text-5xl">2000+</p>
              <p className="text-[10px] sm:text-[12px] lg:text-[18px] text-[#00000099]">
                Сайн Чанарын Бүтээгдэхүүн
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[22px] sm:text-4xl lg:text-5xl">30,000+</p>
            <p className="text-[10px] sm:text-[12px] lg:text-[18px] text-[#00000099]">
              Идэвхтэй Үйлчлүүлэгчид
            </p>
          </div>
        </div>
        <div className="relative flex  md:w-[50%] ">
          <img src="Rectangle.png" className=" bg-right-bottom z-2" />
          <svg
            width="66"
            height="66"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-10 right-24"
          >
            <path
              d="M22 0C22.7469 11.8271 32.1728 21.2531 44 22C32.1728 22.7469 22.7469 32.1728 22 44C21.2531 32.1728 11.8271 22.7469 0 22C11.8271 21.2531 21.2531 11.8271 22 0Z"
              fill="black"
            />
          </svg>
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-48 left-12 "
          >
            <path
              d="M22 0C22.7469 11.8271 32.1728 21.2531 44 22C32.1728 22.7469 22.7469 32.1728 22 44C21.2531 32.1728 11.8271 22.7469 0 22C11.8271 21.2531 21.2531 11.8271 22 0Z"
              fill="black"
            />
          </svg>
        </div>
      </main>
      <div className="bg-[#ffffff] w-full my-24 flex items-center justify-center">
        <div className="flex flex-col w-full max-w-7xl px-4 items-center">
          <div className="mt-6">
            <p className="text-[#000000] text-[32px] sm:text-6xl font-bold text-center">
              ШИНЭЭР ИРСЭН
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="flex gap-6  mt-6 pl-4">
          { newArrival.map((product: any) => (  
                <div
                  key={product.id}
                  className="flex flex-col min-w-[220px] sm:min-w-[250px]"
                >
                  <div className="w-[220px] h-[230px] sm:w-[250px] sm:h-[260px] bg-[url(/podolk.png)] bg-cover bg-center rounded-xl"></div>
                  <p className="text-base sm:text-lg font-semibold mt-2">
                   {product.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-1 text-yellow-500">★★★★</div>
                    <div className="text-sm sm:text-base">4.5/{product.rating}</div>
                  </div>
                  <div className="text-sm sm:text-lg font-bold">${product.price}</div>
                </div>
       ))   }
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