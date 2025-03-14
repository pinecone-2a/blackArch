"use client";

import HomeHeader from "../_components/homeHeader";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <div>
      <HomeHeader />
      <main className="bg-[#F2F0F1] flex flex-col pt-6 items-center">
        <div className="w-[90%]">
          <p className="text-[#000000] text-[24px] font-bold ">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </p>
        </div>
        <div className="w-[90%]">
          <p className="text-[#000000bf] text-[13px] mt-4">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
        </div>
        <div className="w-[90%] bg-[#000000] rounded-[62px] h-[40px] flex items-center justify-center mt-6">
          <p className="text-[#ffffff]">Shop now</p>
        </div>
        <div className="w-[70%] flex justify-between mt-4 items-center">
          <div>
            <p className="text-[22px]">200+</p>
            <p className="text-[10px] text-[#00000099]">International Brands</p>
          </div>
          <div className="h-12 w-[2px] bg-[#000000] opacity-[10%]"></div>
          <div>
            <p className="text-[22px]">2000+</p>
            <p className="text-[10px] text-[#00000099]">
              High-Quality Products
            </p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-[22px]">30,000+</p>
          <p className="text-[10px] text-[#00000099]">Happy Customers</p>
        </div>
        <div className="relative">
          <img src="Rectangle 2.png" />
          <svg
            width="66"
            height="66"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-10 right-6"
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
            className="absolute top-24 left-6"
          >
            <path
              d="M22 0C22.7469 11.8271 32.1728 21.2531 44 22C32.1728 22.7469 22.7469 32.1728 22 44C21.2531 32.1728 11.8271 22.7469 0 22C11.8271 21.2531 21.2531 11.8271 22 0Z"
              fill="black"
            />
          </svg>
        </div>
      </main>
      <div className="bg-[#ffffff] w-full">
        <div className="flex flex-col items-center">
          <div className="w-[60%] mt-18">
            <p className="text-[#000000] text-[30px]">NEW ARRIVALS</p>
          </div>
          <div className="flex gap-4 w-full mt-6">
            <div className="flex flex-col">
              <div className="w-[190px] h-[200px] bg-[url(/podolk.png)] bg-cover bg-center rounded-xl"></div>
              <p>T-shirt with Tape Details</p>
              <div className="flex gap-1">
                <Star size={18} />
                <Star size={18} />
                <Star size={18} />
                <Star size={18} />
                <Star size={18} />
              </div>
              <div>120$</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
