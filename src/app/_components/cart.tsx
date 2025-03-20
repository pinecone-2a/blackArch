"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Minus, Plus, Tag } from "lucide-react";
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
  const [cart, setCart] = useState(initialCart);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const deliveryFee = 15;

  interface CartItem {
    id: number;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }

  type UpdateQuantityType = "increase" | "decrease";

  const updateQuantity = (id: number, type: UpdateQuantityType) => {
    setCart((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "increase"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  interface RemoveItemType {
    (id: number): void;
  }

  const removeItem: RemoveItemType = (id) => {
    setCart((prevCart: CartItem[]) =>
      prevCart.filter((item: CartItem) => item.id !== id)
    );
  };

  const applyPromoCode = () => {
    if (promoCode === "Bilguun") {
      setDiscount(0.2);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      <div className="flex flex-col md:flex-row md:gap-10">
        <div className="md:w-2/3 space-y-4 bg-white p-4 rounded-lg shadow-lg">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <Card
                key={item.id}
                className="flex p-4 justify-between rounded-lg border relative"
              >
                <div className="flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-25 h-25 rounded-lg object-cover"
                  />

                  <CardContent>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                    <p className="font-bold mt-1 text-xl">${item.price}</p>
                  </CardContent>
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-3 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, "decrease")}
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
                    onClick={() => updateQuantity(item.id, "increase")}
                    className="w-8 h-8"
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:bg-red-100 rounded-full p-2"
                >
                  <Trash2 size={18} />
                </button>

                {index !== cart.length - 1 && <div className="border-b" />}
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          )}
        </div>

        <div className="md:w-1/3 mt-6 md:mt-0">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold">Order Summary</h3>
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

            <div className="mt-4 flex space-x-2">
              <Input
                type="text"
                placeholder="Add promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={applyPromoCode}>Apply</Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Use promo code <b>Bilguun</b> for 20% discount
            </p>
            <Button className="w-full mt-4">Go to Checkout →</Button>
          </div>
        </div>
      </div>

      <div className="bg-black text-white p-6 mt-10 rounded-lg text-center">
        <h3 className="text-xl font-bold">
          STAY UP TO DATE ABOUT OUR LATEST OFFERS
        </h3>
        <div className="flex mt-4 color-white">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 text-white"
          />
          <Button className="ml-2">Subscribe to Newsletter</Button>
        </div>
      </div>
    </div>
  );
}
