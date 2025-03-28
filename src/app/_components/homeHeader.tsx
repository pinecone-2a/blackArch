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
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { json } from "stream/consumers";



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const product = localStorage.getItem('cart');
  const data = JSON.parse(product);


  interface HitType {
    objectID: string;
    [key: string]: any;
    name: string;
    description: string;
    image: string
    id: string
    objectId: string
  }

  const cartCount = data.length;
  return (
    <div className="sticky z-10  w-full mx-auto flex px-10 top-0 bg-white  pb-4">
      <nav className="bg-white w-full p-4 xsm:px-6 md:px-24 pb-0 py-4 flex items-center gap-12 justify-between">
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
            <p className="hover:underline">
              <Link href={"/category"}>Shop</Link>
            </p>
            <p className="hover:underline">
              <Link href={"/category"}>New Arrivals</Link>
            </p>
            <p className="hover:underline">
              <Link href={"/category"}>Top Selling</Link>
            </p>
            <p className="hover:underline">
              <Link href={"/category"}>On Sale</Link>
            </p>
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
        input: "w-full h-10 px-3 text-md bg-transparent outline-none placeholder-gray-400 focus:ring-0",
        submit: "hidden", 
        reset: "hidden", 
      }}
      placeholder="Search..."
      onKeyDown={(e) => setIsOpen(true)} // Open dropdown on typing
      onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Close on blur (with delay)
      submitIconComponent={() => (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <Search className="w-5 h-5 text-gray-700" />
        </motion.button>
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
   </div>

        <div className="flex gap-3 xsm:mt-3">
          <div className="relative">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          <Sheet>
  <SheetTrigger>
            <div className="lg:hidden">
            <Menu/>
            </div>
  </SheetTrigger>
  <SheetContent className="bg-white">
  <SheetHeader>
      <SheetDescription>
    <div className="my-1.5 ">
        <div className="flex flex-col text-lg gap-8">
          <Link href={"/category"}><span>
              Shop
            </span></Link>
            <Link href={"/category"}><span>
              New Arrivals
            </span></Link>
            <Link href={"/category"}><span >
              Top Selling
            </span></Link>
            <Link href={"/category"}><span>
              On Sale
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
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <Search className="w-5 h-5 text-gray-700" />
        </motion.button>
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
