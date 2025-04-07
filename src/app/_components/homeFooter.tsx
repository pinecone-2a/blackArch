"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with newsletter */}
        <div className="flex flex-col md:flex-row sm:flex-row sm:justify-between justify-between items-start mb-12 gap-8">
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h2 className="text-2xl font-bold mb-4">Pineshop</h2>
            <p className="text-gray-400 mb-6">
              Өөрийн загварт тохирсон хувцсыг олоорой. Шинэ загвар, шилдэг брэндүүдийн бүтээгдэхүүнийг нэг дороос.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/amaraa_pnc/" className="hover:text-gray-300 transition">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100028159704098" className="hover:text-gray-300 transition">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/watch?v=LPTlvQ1Zet0" className="hover:text-gray-300 transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h3 className="text-lg font-semibold mb-4">ХОЛБООС</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h3 className="text-lg font-semibold mb-4">ХОЛБОО БАРИХ</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span className="text-gray-400">Улаанбаатар хот, Сүхбаатар дүүрэг, Бага тойруу 8-р хороо</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} />
                <span className="text-gray-400">+976 9534 2030</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} />
                <span className="text-gray-400">Pineshop.mn</span>
              </li>
            </ul>
          </div>
          
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <h3 className="text-lg font-semibold mb-4">МЭДЭЭЛЭЛ АВАХ</h3>
            <p className="text-gray-400 mb-4">Шинэ бүтээгдэхүүн болон урамшууллын талаар мэдээлэл авахыг хүсвэл:</p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="И-мэйл хаяг" 
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                Бүртгүүлэх
              </Button>
            </div>
          </div>
        </div>
      
        
        <div className="border-t border-gray-800 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Pineshop. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-gray-500 text-sm hover:text-white transition">
              Үйлчилгээний нөхцөл
            </Link>
            <Link href="/privacy" className="text-gray-500 text-sm hover:text-white transition">
              Нууцлалын бодлого
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;