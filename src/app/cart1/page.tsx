"use client";
import Cart from "../_components/cart";
import Footer from "../_components/homeFooter";
import Navbar from "../_components/homeHeader";
import Template from "../_components/template";

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Template>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Cart />
          </div>
          <Footer />
        </div>
      </Template>
    </div>
  );
}
