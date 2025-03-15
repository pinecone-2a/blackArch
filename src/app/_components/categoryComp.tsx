"use client";
import React, { useState } from "react";
import { Filter, ShoppingCart, Search, SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

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
    rating: 5.0,
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
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center py-4 border-b">
        <h1 className="text-xl font-bold">SHOP.CO</h1>
        <div className="flex gap-4">
          <Search className="w-5 h-5 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
          <Filter
            className="w-5 h-5 cursor-pointer"
            onClick={() => setShowFilters(true)}
          />
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 my-2">
        Home &gt; <span className="font-semibold">Casual</span>
      </div>

      {/* Category Title */}
      <h2 className="text-2xl font-bold mb-4">
        Casual{" "}
        <span className="text-gray-500 text-sm">
          Showing 1-10 of 100 Products
        </span>
      </h2>

      <div className="w-full md:w-1/4 bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold">Filters</h2>
          <SlidersHorizontal className="w-5 h-5" />
        </div>

        {/* Price Slider */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Price</h3>
          <Slider defaultValue={[50, 200]} min={0} max={500} step={10} />
          <Button className="w-full mt-4 bg-black text-white">Apply</Button>
        </div>

        {/* Colors */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Colors</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              "#8B4513",
              "#8B0000",
              "#2E8B57",
              "#000000",
              "#4682B4",
              "#DAA520",
              "#DC143C",
            ].map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full cursor-pointer"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Dress Style */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Dress Style</h3>
          {["Casual", "Formal", "Party", "Gym"].map((style, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Checkbox id={style} />
              <label htmlFor={style} className="text-sm">
                {style}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products.map((product) => (
          <Card key={product.id} className="p-2">
            <CardContent className="flex border-none flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-xl"
              />
              <h2 className="text-sm font-medium mt-2 text-center">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-bold">${product.price}</p>
                {product.oldPrice && (
                  <p className="text-sm line-through text-gray-500">
                    ${product.oldPrice}
                  </p>
                )}
                {product.discount > 0 && (
                  <Badge variant="destructive">-{product.discount}%</Badge>
                )}
              </div>
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

      <Separator />

      {/* Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 text-sm text-gray-600">
        <div>
          <h3 className="font-semibold">FAQ</h3>
          <ul className="text-gray-500">
            <li>Account</li>
            <li>Manage Deliveries</li>
            <li>Orders</li>
            <li>Payment</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">HELP</h3>
          <ul className="text-gray-500">
            <li>Customer Support</li>
            <li>Delivery Details</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <p className="col-span-full text-center text-gray-400 mt-4">
          Shop.co © 2025, All Rights Reserved
        </p>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="w-full sm:w-3/4 md:w-1/3 bg-white p-6 rounded-lg h-auto max-h-[90%] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            <p className="text-sm mb-6">Category, Price, Size, Color, etc.</p>
            <Button
              className="w-full mt-4 bg-black text-white"
              onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
