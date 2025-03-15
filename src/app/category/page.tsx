"use client";
import React, { useState } from "react";
import { Filter, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    price: 145,
    oldPrice: 242,
    discount: 20,
    rating: 3.5,
    image: "image 8.png",
  },
  {
    id: 2,
    name: "Polo with Tipping Detail",
    price: 180,
    oldPrice: 242,
    discount: 20,
    rating: 4.5,
    image: "image 9.png",
  },
  {
    id: 3,
    name: "Black Striped T-shirt",
    price: 120,
    oldPrice: 150,
    discount: 30,
    rating: 4.0,
    image: "image 10.png",
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    price: 240,
    oldPrice: 260,
    discount: 20,
    rating: 3.5,
    image: "image 11.png",
  },
];

export default function ShopPage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center py-4">
        <h1 className="text-xl font-bold">SHOP.CO</h1>
        <div className="flex gap-3">
          <Search className="w-5 h-5" />
          <ShoppingCart className="w-5 h-5" />
          <Filter
            className="w-5 h-5 cursor-pointer"
            onClick={() => setShowFilters(true)}
          />
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-2">
        Home &gt; <span className="font-semibold">Casual</span>
      </div>

      {/* Category Title */}
      <h2 className="text-2xl font-bold mb-4">
        Casual{" "}
        <span className="text-gray-500 text-sm">
          Showing 1-10 of 100 Products
        </span>
      </h2>

      {/* Product List */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-2">
            <CardContent>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-30 rounded-2xl"
              />
              <h2 className="text-sm font-medium mt-2">{product.name}</h2>
              <p className="text-lg font-bold">${product.price}</p>
              <p className="text-sm line-through text-gray-500">
                ${product.oldPrice}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center my-6">
        <Button variant="outline">Previous</Button>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-gray-800 text-white">
            1
          </Button>
          <span className="text-gray-500">...</span>
          <Button variant="outline">10</Button>
        </div>
        <Button variant="outline">Next</Button>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-sm h-96">
        <p className="mt-5 text-gray-700 ml-3.5">
          We have clothes that suit your style and which you’re proud to wear.
          From women to men.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4">
            <h3 className="font-semibold tracking-[3px]">FAQ</h3>
            <ul className="text-gray-500">
              <li>Account</li>
              <li>Manage Deliveries</li>
              <li>Orders</li>
              <li>Payment</li>
            </ul>
          </div>
          <div className="p-4">
            <h3 className="font-semibold tracking-[3px]">HELP</h3>
            <ul className="text-gray-500 gap-10">
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-4">
          Shop.co © 2000-2023, All Rights Reserved
        </p>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div className="w-3/4 bg-white p-4 h-full">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            <p>Category, Price, Size, Color, etc.</p>
            <Button
              className="w-full mt-4"
              onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
