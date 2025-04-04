"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import Reveal from "./Reavel";
import Link from "next/link";

const initialCart = [{}];

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
  const storedCart =
    typeof window !== "undefined" ? localStorage.getItem("cart") : null;
  const initialCartState: CartItem[] = storedCart
    ? JSON.parse(storedCart)
    : initialCart;

  const [cart, setCart] = useState<CartItem[]>(initialCartState);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 5000;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const removeItem = (productId: string): void => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
      {cart.length > 0 ? (
        <>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Таны сагсанд байгаа бүтээгдэхүүнүүд
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-4 w-full">
              {cart.map((item: CartItem) => (
                <Card
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-center p-4 sm:p-6 gap-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200 relative w-full group"
                >
                  <div className="bg-gray-50 rounded-lg p-2 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                    />
                  </div>

                  <CardContent className="flex-1 text-center sm:text-left p-0 pt-2 sm:p-0">
                    <h3 className="font-bold text-lg sm:text-xl">
                      {item.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-1 text-gray-600">
                      <p className="text-sm">
                        {item.size ? `Size: ${item.size}` : ""}
                      </p>
                      <p className="text-sm">
                        {item.color ? `Color: ${item.color}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">
                          -
                        </button>
                        <span className="mx-3 font-medium">
                          {item.quantity}
                        </span>
                        <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100">
                          +
                        </button>
                      </div>
                      <p className="font-bold text-xl sm:text-2xl">
                        ₮{item.price}
                      </p>
                    </div>
                  </CardContent>

                  <Button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-4 right-4 text-white rounded-full h-8 w-8 p-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </Card>
              ))}

              <div className="mt-6 flex justify-between items-center">
                <Link href="/category">
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:w-1/3 w-full mt-8 lg:mt-0">
              <div className="bg-white border shadow-sm p-6 rounded-xl sticky top-28">
                <h3 className="text-xl font-bold border-b pb-4 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-medium">₮{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount ({discount * 100}%)</span>
                      <span>- ₮{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Delivery Fee</span>
                    <span className="font-medium">
                      ₮{deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t my-3 pt-3"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₮{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      onClick={() =>
                        setDiscount(promoCode === "Pineshop" ? 0.05 : 0)
                      }
                      variant="outline"
                      size="sm"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <b>Pineshop</b> промо кодыг ашигласнаар 5% хөнгөлөлт авах
                  боломжтой.
                </p>

                <Link href="/payment">
                  <Button className="w-full mt-6 py-6 bg-black hover:bg-gray-800 rounded-xl text-lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="bg-white border rounded-xl shadow-sm p-10 max-w-md w-full text-center">
            <div className="mx-auto w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-14 h-14 text-gray-400" />
            </div>
            <h1 className="font-extrabold text-3xl">Таны сагс хоосон байна.</h1>
            <p className="mt-3 text-gray-500 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link href="/category">
              <Button className="rounded-xl px-10 py-6 bg-black hover:bg-gray-800 text-white text-lg">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
