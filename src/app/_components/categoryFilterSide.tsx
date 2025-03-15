"use client";
import { useState } from "react";
import { SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryFilterSide() {
  const [openSections, setOpenSections] = useState({
    type: true,
    price: true,
    colors: false,
    dressStyle: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-[375px] h-auto border-2 rounded-3xl mx-10 my-6 p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-2xl">Filters</h1>
        <SlidersHorizontal />
      </div>
      <div className="w-full h-[1px] bg-gray-400" />

      {/* Type Filter */}
      <div className="mt-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("type")}>
          <h1 className="font-bold text-xl">Type</h1>
          {openSections.type ? <ChevronUp /> : <ChevronDown />}
        </div>
        {openSections.type && (
          <div className="flex flex-col text-lg font-medium gap-2 mt-2">
            {["T-shirts", "Shirts", "Jeans", "Shorts"].map((item) => (
              <label key={item} className="flex justify-between mx-1 gap-2">
                {item}
                <Checkbox />
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-400 my-4" />

      {/* Price Filter */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("price")}>
          <h1 className="font-bold text-xl">Price</h1>
          {openSections.price ? <ChevronUp /> : <ChevronDown />}
        </div>
        {openSections.price && (
          <div>
            <div className="flex items-center justify-center gap-3 mt-3">
              <Input className="w-[85px] h-[40px]" placeholder="$0" />
              <span className="text-2xl text-gray-400">-</span>
              <Input className="w-[85px] h-[40px]" placeholder="$500" />
            </div>
            <div className="flex justify-center my-5">
              <Button className="w-[65%] text-md rounded-2xl">Apply</Button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-400 my-4" />

      {/* Colors Filter */}
      <div>
        <div
          className="flex items-center my-5 justify-between cursor-pointer"
          onClick={() => toggleSection("colors")}>
          <h1 className="font-bold text-xl">Colors</h1>
          {openSections.colors ? <ChevronUp /> : <ChevronDown />}
        </div>
        {openSections.colors && (
          <div className="flex gap-2 flex-wrap mt-3">
            {[
              "#8B4513",
              "#8B0000",
              "#2E8B57",
              "#000000",
              "#4682B4",
              "#DAA520",
            ].map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-400 my-4" />

      {/* Dress Style Filter */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("dressStyle")}>
          <h1 className="font-bold text-xl">Dress Style</h1>
          {openSections.dressStyle ? <ChevronUp /> : <ChevronDown />}
        </div>
        {openSections.dressStyle && (
          <div className="flex flex-col text-lg font-medium gap-2 mt-2">
            {["Casual", "Formal", "Party", "Sport"].map((style) => (
              <label key={style} className="flex justify-between mx-1 gap-2">
                {style}
                <Checkbox />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
