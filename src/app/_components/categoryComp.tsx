import HomeHeader from "./homeHeader";
import Footer from "./homeFooter";
import Image from "next/image";
import { Star } from "lucide-react";
import CategoryFilterSide from "./categoryFilterSide";
import { Button } from "@/components/ui/button";
export default function CategoryComp() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 ">
      <HomeHeader />
      <div className="flex flex-col md:flex-row p-4 mx-5">
        <CategoryFilterSide />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border shadow-md p-4 flex flex-col items-center"
            >
              <div className="w-48 h-48 bg-[url(/podolk.png)] bg-cover bg-center rounded-xl"></div>
              <p className="mt-4 text-center font-semibold">T-shirt with Tape Details</p>
              <div className="flex gap-1 mt-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} />
                ))}
              </div>
              <div className="mt-2 text-lg font-bold text-gray-700">$120</div>
          <Button className="w-[70%] text-md rounded-2xl">Add to Cart</Button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}