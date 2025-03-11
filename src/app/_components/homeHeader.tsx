"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function HomeHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <header className="p-3 flex justify-between items-center">
        <Image src="/headerlogo.png" width={150} height={150} alt="logo" />
        <button onClick={() => setIsOpen(true)} className="text-xl">
          <Menu />
        </button>
      </header>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }} 
            animate={{ opacity: 1, y: "0%" }} 
            exit={{ opacity: 0, y: "-100%" }} 
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-gray-500 bg-opacity-95 flex flex-col items-center justify-center z-50"
          >
            <Image
              src="/headerlogo.png"
              width={150}
              height={150}
              alt="logo"
              className="absolute top-3 left-3"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-7 right-3 text-white text-3xl"
            >
              <X />
            </button>
            <nav className="text-white text-xl mt-8 flex flex-col items-start space-y-4">
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1">
      Our Products <ChevronDown />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center">
      <DropdownMenuLabel>Mongolian Yurts</DropdownMenuLabel>
      <DropdownMenuItem>Accessories & Parts</DropdownMenuItem>
      <DropdownMenuItem>History about Mongolian Yurts</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Link href="/">
    <p className="block hover:underline">Delivery Options</p>
  </Link>

  <Link href="/gallery">
    <p className="block hover:underline">Gallery</p>
  </Link>

  <Link href="/about">
    <p className="block hover:underline">About</p>
  </Link>
</nav>
            <Input
              className="w-[75%] text-white h-[45px] rounded-2xl mt-4"
              placeholder="Search..."
            />
            <Button className="w-[75%] h-[45px] rounded-2xl mt-6 text-xl">
              Contact us <ArrowRight />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
