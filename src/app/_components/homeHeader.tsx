import { Menu } from "lucide-react";
import { Search } from "lucide-react";
import { ShoppingCart } from "lucide-react";

export default function HomeHeader() {
  return (
    <div className="bg-[#ffffff] h-[65px] flex items-center justify-between px-10 ">
      <div className="flex items-center gap-2 ">
        <Menu size="24" />
        <div className="font-bold text-[21px]">SHOP.CO</div>
      </div>
      <div className="flex  items-center gap-2">
        <Search size="24" />
        <ShoppingCart size="24" />
      </div>
    </div>
  );
}
