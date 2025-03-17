import HomeHeader from "./homeHeader";
import Footer from "./homeFooter";
import Image from "next/image";
import CategoryFilterSide from "./categoryFilterSide";
export default function categoryComp() {
  return (
    <div>
      <HomeHeader />
      <div className="flex">
        <CategoryFilterSide />
        <div className="w-[70%] h-[1200px] bg-white rounded-3xl border">
          <div className="w-[280px] h-[360px] m-6  border shadow-sm  ">
            <Image src={"/t-shirt.png"} width={280} height={280} alt="item" />
            <div className="bg-blue-400 p-3 ">
              <p className="font-bold text-xl">Tolbotoi podwolk</p>
              <p className="font-medium  text-md">120$</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
