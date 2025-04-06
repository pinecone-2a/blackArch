"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CategoryFilterSide() {
  const [openSections, setOpenSections] = useState({
    type: true,
    price: true,
    colors: true,
    dressStyle: true,
  });
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({
    type: [] as string[],
    price: { min: 0, max: 500 },
    colors: [] as string[],
    dressStyle: [] as string[],
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[category as keyof typeof prev];
      const isSelected =
        Array.isArray(updatedCategory) && updatedCategory.includes(value);
      return {
        ...prev,
        [category]: isSelected
          ? updatedCategory.filter((item) => item !== value)
          : Array.isArray(updatedCategory)
          ? [...updatedCategory, value]
          : updatedCategory,
      };
    });
  };

  const handlePriceChange = (min: string, max: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      price: {
        min: parseInt(min) || 0,
        max: parseInt(max) || 500,
      },
    }));
  };

  const applyFilters = () => {
    console.log("Filters applied:", selectedFilters);
  };

  return (
    <motion.div
      initial={{ height: 70 }}
      animate={{ height: isFilterVisible ? "auto" : 70 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden w-full border bg-white rounded-xl shadow-sm p-5 sticky top-28 mt-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-2xl">Ангилал</h1>
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
              <h1 className="font-bold text-xl">Төрөл</h1>
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
                {["Футболкa & Майк", "Гадуур хувцас", "Өмд & Шорт", "Свитер & Малгайтай цамц",].map((item) => (
                  <label key={item} className="flex justify-between mx-1 gap-2">
                    {item}
                    <Checkbox
                      checked={selectedFilters.type.includes(item)}
                      onChange={() => handleCheckboxChange("type", item)}
                    />
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
              <h1 className="font-bold text-xl">Үнэ</h1>
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
                  <Input
                    className="w-[85px] h-[40px]"
                    value={selectedFilters.price.min}
                    onChange={(e) =>
                      handlePriceChange(
                        e.target.value,
                        `${selectedFilters.price.max}`
                      )
                    }
                    placeholder="$0"
                  />
                  <span className="text-2xl text-gray-400">-</span>
                  <Input
                    className="w-[85px] h-[40px]"
                    value={selectedFilters.price.max}
                    onChange={(e) =>
                      handlePriceChange(
                        `${selectedFilters.price.min}`,
                        e.target.value
                      )
                    }
                    placeholder="$500"
                  />
                </div>
                <div className="flex justify-center my-5">
                  <Button
                    onClick={applyFilters}
                    className="w-[65%] text-md rounded-2xl"
                  >
                    Хайх
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
