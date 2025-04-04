"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryFilterSide() {
  const [openSections, setOpenSections] = useState({
    type: false,
    price: false,
    colors: false,
    dressStyle: false,
  });
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ height: 70 }}
      animate={{ height: isFilterVisible ? "auto" : 70 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-[375px]  overflow-hidden  w-full border-2 rounded-3xl my-6 p-5 mx-auto sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[40%] "
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-2xl">Filters</h1>
        <SlidersHorizontal
          className="cursor-pointer"
          onClick={toggleFilterVisibility}
        />
      </div>
      {isFilterVisible && (
        <>
          <div className="w-full h-[1px] bg-gray-400" />
          <div className="mt-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("type")}
            >
              <h1 className="font-bold text-xl">Type</h1>
              {openSections.type ? <ChevronUp /> : <ChevronDown />}
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openSections.type ? "auto" : 0,
                opacity: openSections.type ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col text-lg font-medium gap-2 mt-2">
                {["T-shirts", "Shirts", "Jeans", "Shorts"].map((item) => (
                  <label key={item} className="flex justify-between mx-1 gap-2">
                    {item}
                    <Checkbox />
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="w-full h-[1px] bg-gray-400 my-4" />
          <div>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("price")}
            >
              <h1 className="font-bold text-xl">Price</h1>
              {openSections.price ? <ChevronUp /> : <ChevronDown />}
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openSections.price ? "auto" : 0,
                opacity: openSections.price ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
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
            </motion.div>
          </div>

          <div className="w-full h-[1px] bg-gray-400 my-4" />
          <div>
            <div
              className="flex items-center my-5 justify-between cursor-pointer"
              onClick={() => toggleSection("colors")}
            >
              <h1 className="font-bold text-xl">Colors</h1>
              {openSections.colors ? <ChevronUp /> : <ChevronDown />}
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openSections.colors ? "auto" : 0,
                opacity: openSections.colors ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
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
            </motion.div>
          </div>

          <div className="w-full h-[1px] bg-gray-400 my-4" />
          <div>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("dressStyle")}
            >
              <h1 className="font-bold text-xl">Dress Style</h1>
              {openSections.dressStyle ? <ChevronUp /> : <ChevronDown />}
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openSections.dressStyle ? "auto" : 0,
                opacity: openSections.dressStyle ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col text-lg font-medium gap-2 mt-2">
                {["Casual", "Formal", "Party", "Sport"].map((style) => (
                  <label
                    key={style}
                    className="flex justify-between mx-1 gap-2"
                  >
                    {style}
                    <Checkbox />
                  </label>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
