"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Minus, Plus } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/lib/userContext";

const initialCart = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    size: "Large",
    color: "White",
    price: 145,
    quantity: 1,
    image: "/reallogo.jpg",
  },
  {
    id: 2,
    name: "Checkered Shirt",
    size: "Medium",
    color: "Red",
    price: 180,
    quantity: 1,
    image: "/reallogo.jpg",
  },
  {
    id: 3,
    name: "Skinny Fit Jeans",
    size: "Large",
    color: "Blue",
    price: 240,
    quantity: 1,
    image: "/reallogo.jpg",
  },
];

export default function Cart() {
  const [cart, setCart] = useState(initialCart);
  const discountRate = 0.2;
  const deliveryFee = 15;
  const user = useContext(UserContext);
  console.log("hereglegch",user)

  interface CartItem {
    id: number;
    name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }

  type UpdateType = "increase" | "decrease";

  const updateQuantity = (id: number, type: UpdateType) => {
    setCart(
      cart.map((item: CartItem) =>
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

  const removeItem = (id: number) => {
    setCart(cart.filter((item: CartItem) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = subtotal * discountRate;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <Card key={item.id} className="flex items-center p-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded"
            />
            <CardContent className="ml-4 flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {item.size} | Color: {item.color}
              </p>
              <p className="font-semibold mt-1">${item.price}</p>
            </CardContent>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, "decrease")}
              >
                <Minus size={14} />
              </Button>
              <span className="w-6 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, "increase")}
              >
                <Plus size={14} />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
            >
              <Trash size={16} className="text-red-500" />
            </Button>
          </Card>
        ))}
      </div>

      <div className="bg-gray-100 p-4 mt-6 rounded-lg">
        <h3 className="text-lg font-bold">Order Summary</h3>
        <div className="flex justify-between mt-2">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount (-20%)</span>
          <span>-${discount.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${deliveryFee}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>${total.toFixed(0)}</span>
        </div>
        <Button className="w-full mt-4">Go to Checkout →</Button>
      </div>
    </div>
  );
}
