"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

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
];

export default function Cart() {
  const product = localStorage.getItem('cart');
  const data = JSON.parse(product);
  const [cart, setCart] = useState(data);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 15;
  console.log(data);

  interface CartItem {
    id: number;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
    description: string
  }

  type UpdateQuantityType = "increase" | "decrease";

  // const updateQuantity = (id: number, type: UpdateQuantityType): void => {
  //   setCart((prevCart) =>
  //     prevCart.map((item) =>
  //       item.id === id
  //         ? {
  //             ...item,
  //             quantity:
  //               type === "increase"
  //                 ? item.quantity + 1
  //                 : Math.max(1, item.quantity - 1),
  //           }
  //         : item
  //     )
  //   );
  // };

  const removeItem = (id: number): void => {
    setCart((prevCart: CartItem[]) =>
      prevCart.filter((item: CartItem) => item.id !== id)
    );
  };

  const applyPromoCode = () => {
    setDiscount(promoCode === "Pineshop" ? 0.2 : 0);
  };

  // const subtotal = cart.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );
  // const discountAmount = subtotal * discount;
  // const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 space-y-4 bg-white p-4 rounded-lg shadow-lg w-full">
          {cart.length > 0 ? (
            cart.map((item: CartItem) => (
              <Card
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4 rounded-lg border relative w-full"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                />
                <CardContent className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                  <p className="font-bold mt-1 text-xl">${item.price}</p>
                </CardContent>
                <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-3 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => updateQuantity(item.id, "decrease")}
                    className="w-8 h-8"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-6 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    // onClick={() => updateQuantity(item.id, "increase")}
                    className="w-8 h-8"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <Button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:bg-red-100 rounded-full p-2"
                >
                  <Trash2 size={18} />
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          )}
        </div>

        <div className="lg:w-1/3 w-full">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-center">Order Summary</h3>
            <div className="mt-4 space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                {/* <span className="font-bold">${subtotal.toFixed(2)}</span> */}
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount ({discount * 100}%)</span>
                {/* <span>- ${discountAmount.toFixed(2)}</span> */}
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold">${deliveryFee.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total</span>
              {/* <span>${total.toFixed(2)}</span> */}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="text"
                placeholder="Add promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={applyPromoCode}>Apply</Button>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Use promo code <b>Bilguun</b> for 20% discount
            </p>
            <Button className="w-full mt-4">Go to Checkout →</Button>
          </div>
        </div>
      </div>
    </div>
  );
}