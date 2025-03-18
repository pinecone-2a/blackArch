import HomeHeader from "./homeHeader";
import Footer from "./homeFooter";
import Image from "next/image";
import { Star } from "lucide-react";
import CategoryFilterSide from "./categoryFilterSide";
import { Button } from "@/components/ui/button";

export default function CategoryComp() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <div className="flex flex-col md:flex-row p-4 2xl:mx-20 xl:mx-0 lg:mx-0 md:mx-0 sm:mx-0">
        <CategoryFilterSide />

        <div className="flex flex-wrap justify-center md:grid md:grid-cols-3 lg:grid-cols-4 2xl:mx-20 xl:mx-0 lg:mx-0 md:mx-0 sm:mx-0 gap-4 p-4 w-full">
          <div className="group bg-white w-[300px] h-[250px] rounded-xl border shadow-md p-3 flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out hover:h-[300px]">
            <Image src="/t-shirt.png" width={150} height={150} alt="T-shirt" />
            <p className="mt-5 text-center font-semibold text-gray-800">
              T-shirt with Tape Details
            </p>
            <div className="my-1 text-lg font-bold text-gray-700">$130</div>
            <div className="absolute bottom-0 w-full flex justify-center">
              <Button className="opacity-0 text-lg translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out w-full h-[50px] rounded-bl-xl rounded-br-xl !rounded-t-none">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
