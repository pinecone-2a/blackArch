"use client";

import Cart from "../_components/cart";
import Footer from "../_components/homeFooter";
import Navbar from "../_components/homeHeader";
import Template from "../_components/template";

export default function CartPage() {
  return (
    <div>
      <Template>
        <Navbar />
        <Cart />
        <Footer />
      </Template>
    </div>
  );
}
