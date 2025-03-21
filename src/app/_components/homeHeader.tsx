import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
export default function Navbar() {
  return (
    <div className='sticky 2xl:w-[80%] mx-auto flex px-10 top-0 bg-white z-20 pb-4'>
      <nav className="bg-white w-full mainPadding py-4 flex items-center nav:gap-12 gap-0 justify-between">
        <span>
          <Link href={"/"} className="text-3xl xsm:text-4xl font-extrabold">PINESHOP</Link>
        </span>

        <div className="nav:block my-1.5 ">
          <div className="flex text-lg gap-5">
            <p className="hover:underline"> <Link href={"/category"}>Shop</Link> </p>
           <p className="hover:underline"> <Link href={"/category"}>New Arrivals</Link> </p>
           <p className="hover:underline"> <Link href={"/category"}>Top Selling</Link></p> 
           <p className="hover:underline"><Link href={"/category"}>On Sale</Link>  </p> 
          </div>
        </div>

        <form className="bg-gray-100 p-1 px-3 rounded-full hidden nav:flex mt-3 gap-2">
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          <input className="p-1 outline-none w-full bg-transparent" type="text" placeholder="Search for products..." />
        </form>
        <div className="flex items-center gap-3 w-[400px] border-b border-gray-500 pb-2">
      <motion.input
        type="text"
        className="w-full h-10 px-3 text-md bg-transparent outline-none placeholder-gray-400 focus:ring-0"
        placeholder="Search for product..."
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
          <div className='relative'>
            <Link href={"/cart"}>
              <ShoppingCart />
            </Link>
          </div>
          <div className="hidden">
            <Menu/>
          </div>
        </div>
      </nav>
    </div>
  );
}
