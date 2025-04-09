"use client";


import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Autocomplete from "@/components/algolia/AutoComplete";
import NextInstantSearch from "@/components/algolia/NextInstantSearch";
import { searchClient } from "@/lib/algolia/searchClient";
import { INSTANT_SEARCH_INDEX_NAME } from "@/lib/constants/types";
import { Configure } from "react-instantsearch";
import { Hits } from "react-instantsearch";
import HitComponent from "@/components/algolia/HitComponent";
import PopularSearches from "@/components/algolia/PopularSearches";
import CustomPagination from "@/components/algolia/CustomPagination";
import { SearchBox } from "react-instantsearch";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";


const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,

} from "@/components/ui/sheet"



import { json } from "stream/consumers";
import shoppingCart from "./shoppingCart.json";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartData, setCartData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);


  
  useEffect(() => {

    setMounted(true);
    if (typeof window !== 'undefined') {
      const product = localStorage.getItem("cart");
      if (product) {
        try {
          const parsedData = JSON.parse(product);
          setCartData(parsedData);
        } catch (error) {
          console.error("Error parsing cart data:", error);
          setCartData([]);
        }
      }
    }
  }, []);

  interface HitType {
    objectID: string;
    [key: string]: any;
    name: string;
    description: string;
    image: string;
    id: string;
    objectId: string;
  }

  const cartCount = cartData?.length || 0;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto p-4 flex items-center gap-12 justify-between">
        <span>
          <Link
            href={"/"}
            className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-extrabold"
          >
            PINESHOP
          </Link>
        </span>

        <div className="my-1.5 hidden lg:block">
          <div className="flex text-lg gap-5">
            <div className="relative group">
              <Link
                href={"/category"}
                className="text-black text-xl transition-all duration-500 ease-in-out group-hover:text-[#d94f5c]"
              >
                Бүх хувцас
              </Link>

              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d94f5c] scale-x-0 transition-all duration-300 group-hover:scale-x-100"></span>
            </div>
            <div className="relative group">
              <Link
                href={"/category"}
                className="text-black text-xl transition-all duration-500 ease-in-out group-hover:text-[#d94f5c]"
              >
                Шинээр нэмэгдсэн
              </Link>

              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d94f5c] scale-x-0 transition-all duration-300 group-hover:scale-x-100"></span>
            </div>
            <div className="relative group">
              <Link
                href={"/category"}
                className="text-black text-xl transition-all duration-500 ease-in-out group-hover:text-[#d94f5c]"
              >
                Хувцасны төрлүүд
              </Link>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d94f5c] scale-x-0 transition-all duration-300 group-hover:scale-x-100"></span>
            </div>
         


          </div>
        </div>

        <div className="hidden lg:block">
          <NextInstantSearch
            initialUiState={{
              posts: {
                query: "",
                page: 1,
              },
            }}
            searchClient={searchClient}
            indexName={INSTANT_SEARCH_INDEX_NAME}
            routing
            insights
            future={{
              preserveSharedStateOnUnmount: true,
              persistHierarchicalRootCount: true,
            }}
          >
            <SearchBox
              classNames={{
                root: "flex items-center gap-3 min-w-[150px] border-b border-gray-500 pb-2",
                input:
                  "w-full h-10 px-3 text-md bg-transparent outline-none placeholder-gray-400 focus:ring-0",
                submit: "hidden",
                reset: "hidden",
              }}
              placeholder="Search..."
              onKeyDown={(e) => setIsOpen(true)} 
              onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
              submitIconComponent={() => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </motion.div>
              )}
            />
            <Configure hitsPerPage={6} distinct={true} getRankingInfo={true} />
            <div className="flex flex-col items-center"></div>
            <div className="mt-8 flex items-center gap-4 flex-col ">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-1 z-9999"
                >
                  <Hits<HitType>
                    hitComponent={({ hit }) => <HitComponent hit={hit} />}
                  />
                </motion.div>
              )}
            </div>
          </NextInstantSearch>
        </div>

        <div className="flex gap-3 xsm:mt-3">
          <Link 
            href="/profile" 
            className="hidden lg:flex items-center mr-2 hover:text-[#d94f5c] transition-colors"
          >
            My Profile
          </Link>
          <div className="relative">
            {
              mounted &&   <Link href="/cart" className="relative">
              {typeof window !== 'undefined' && (
                <Lottie
                  animationData={shoppingCart}
                  style={{ width: 50, height: 50 }}
                />
              )}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            }
          
          </div>
          <Sheet>

  <SheetTrigger>
            <div className="lg:hidden">
            <Menu/>
            </div>
  </SheetTrigger>
  <SheetContent className="bg-black">
  <SheetHeader>
      <SheetDescription>
    <div className="my-1.5 ">
        <div className="flex flex-col text-lg gap-8">
          <Link href={"/category"}><span>
          Бүх хувцас
            </span></Link>
            <Link href={"/category"}><span>
            Шинээр нэмэгдсэн
            </span></Link>
            <Link href={"/category"}><span >
            Хувцасны төрлүүд
            </span></Link>
            <Link href={"/profile"}><span>
              My Profile
            </span></Link>
          </div>
        </div>
        <NextInstantSearch
        initialUiState={{
          posts: {
            query: "",
            page: 1,
          },
        }}
        searchClient={searchClient}
        indexName={INSTANT_SEARCH_INDEX_NAME}
        routing
        insights
        future={{
          preserveSharedStateOnUnmount: true,
          persistHierarchicalRootCount: true,
        }}
      >
 <SearchBox
      classNames={{
        root: "flex items-center gap-3 min-w-[150px] border-b border-gray-500 pb-2",
        input: "w-full h-10 px-3 text-md bg-transparent outline-none placeholder-gray-400 focus:ring-0",
        submit: "hidden", 
        reset: "hidden", 
      }}
      placeholder="Search..."
      onKeyDown={(e) => setIsOpen(true)} // Open dropdown on typing
      onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Close on blur (with delay)
      submitIconComponent={() => (
        <div className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer">
          <Search className="w-5 h-5 text-gray-700" />
        </div>
      )}
    />
          <Configure hitsPerPage={6} distinct={true} getRankingInfo={true} />
            <div className="flex flex-col items-center">
                        </div>
                        <div className="mt-8 flex items-center gap-4 flex-col ">

                        {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-1 z-9999"
        >
          <Hits<HitType> hitComponent={({ hit }) => <HitComponent hit={hit} />} />
        </motion.div>
   
                        )}
      </div>

         </NextInstantSearch>
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>

        </div>
      </nav>
    </div>
  );
}
