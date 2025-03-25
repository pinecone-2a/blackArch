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
import SearchAlgolia from "@/components/algolia/Search";

export default function Navbar() {
  return (
    <div className="sticky  w-full mx-auto flex px-10 top-0 bg-white z-20 pb-4">
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

        <div className="flex items-center gap-3 min-w-[150px] border-b border-gray-500 pb-2">
          <motion.input
            type="text"
            className="w-full h-10 px-3 text-md bg-transparent outline-none placeholder-gray-400 focus:ring-0"
            placeholder="Search..."
            whileFocus={{ scale: 1.07 }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>

        <div className="flex gap-3 xsm:mt-3">
          <div className="relative">
            <Link href={"/cart"}>
              <ShoppingCart />
            </Link>
          </div>
          <div className="hidden">
            <Menu />
          </div>
        </div>
      </nav>
    </div>
  );
}
