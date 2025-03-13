"use client";

import { Facebook, Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 p-6 text-center text-sm md:text-base">
      <h2 className="text-xl md:text-2xl font-bold">SHOP.CO</h2>
      <p className="text-gray-600 mt-2 max-w-xs mx-auto">
        We have clothes that suit your style and which you’re proud to wear.
        From women to men.
      </p>
      <div className="flex justify-center space-x-4 mt-4">
        <Twitter className="w-5 h-5 md:w-6 md:h-6" />
        <Facebook className="w-5 h-5 md:w-6 md:h-6" />
        <Instagram className="w-5 h-5 md:w-6 md:h-6" />
        <Github className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="flex flex-row md:flex-row justify-around mt-6 text-xs md:text-sm space-y-4 md:space-y-0">
        <div>
          <h3 className="font-bold">FAQ</h3>
          <ul className="text-gray-600 space-y-1">
            <li className="hover:text-black">Account</li>
            <li className="hover:text-black">Manage Deliveries</li>
            <li className="hover:text-black">Orders</li>
            <li className="hover:text-black">Payment</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">HELP</h3>
          <ul className="text-gray-600 space-y-1">
            <li className="hover:text-black">Customer Support</li>
            <li className="hover:text-black">Delivery Details</li>
            <li className="hover:text-black">Terms & Conditions</li>
            <li className="hover:text-black">Privacy Policy</li>
          </ul>
        </div>
      </div>
      <p className="text-gray-500 text-xs md:text-sm mt-6">
        Shop.co © 2000-2023, All Rights Reserved
      </p>
    </footer>
  );
}
