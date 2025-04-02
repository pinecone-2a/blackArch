"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Reveal from "./Reavel";
import Reavel from "./Reavel";
import TransitionLink from "./TransitionLink";
import motion from "framer-motion";
import Image from "next/image";
import Link from "next/link";
const initialCart = [
  {
    id: 1,
    name: "Skinny Fit Jeans",
    size: "Large",
    color: "Light Green",
    price: 240,
    quantity: 1,
    image: "/ger.png",
  },
  {
    id: 2,
    name: "Casual T-Shirt",
    size: "Medium",
    color: "Blue",
    price: 150,
    quantity: 1,
    image: "/shirt.png",
  },
];

interface CartItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Cart() {
  const storedCart = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
  const initialCartState: CartItem[] = storedCart ? JSON.parse(storedCart) : initialCart;

  const [cart, setCart] = useState<CartItem[]>(initialCartState);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 15;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const removeItem = (productId: string): void => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.productId !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart; 
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {cart.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 space-y-4 bg-white p-4 rounded-lg shadow-lg w-full">
              {cart.map((item: CartItem) => (
                <Card key={item.productId} className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4 rounded-lg border relative w-full">
                  <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover" />
                  <CardContent className="flex-1 text-center sm:text-left">
                    <Reveal className="font-bold text-lg">{item.name}</Reveal>
                    <Reveal className="text-sm text-gray-500">Size: {item.size}</Reveal>
                    <Reveal className="text-sm text-gray-500">Color: {item.color}</Reveal>
                    <Reveal className="font-bold mt-1 text-xl">${item.price}</Reveal>
                  </CardContent>
  
                  <Button onClick={() => removeItem(item.productId)} className="text-red-500 hover:bg-red-100 rounded-full p-2">
                    <Trash2 size={18} />
                  </Button>
                </Card>
              ))}
            </div>
  
            <div className="lg:w-1/3 w-full">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-center">Order Summary</h3>
                <div className="mt-4 space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Discount ({discount * 100}%)</span>
                    <span>- ${discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-bold">${deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input type="text" placeholder="Add promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1" />
                  <Button onClick={() => setDiscount(promoCode === "Pineshop" ? 0.2 : 0)}>Apply</Button>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">Use promo code <b>Pineshop</b> for 20% discount</p>
                <Button className="w-full mt-4">Go to Checkout →</Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <Reavel><h1 className="font-extrabold text-4xl xsm:text-5xl">Your Cart is Empty!</h1></Reavel>
          <Reavel><p>Must add items to the cart before you proceed to checkout</p></Reavel>
          <Reavel className="p-4">
            <Link href="/category">
              <Button className="rounded-2xl"> Go to Shop </Button>
            </Link>
          </Reavel>
        </div>
      )}
    </div>
  );
}
