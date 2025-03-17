import HomeHeader from "./homeHeader";
import Footer from "./homeFooter";
import CategoryFilterSide from "./categoryFilterSide";
export default function categoryComp() {
  return (
    <div>
      <HomeHeader />
      <div className="flex">
        <CategoryFilterSide />
        <div className="w-[80%] h-[1200px] bg-gray-600">
          
        </div>
      </div>
      <Footer />
    </div>
  );
}
