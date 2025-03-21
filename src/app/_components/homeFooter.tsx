import { MdOutlineEmail } from "react-icons/md";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Rss,
} from "lucide-react";

export default function Footer() {
  return (
    <div className="w-full px-5 py-10 0">
      {" "}
      <hr className="border-t w-[80%] mx-auto border-black mb-8" />
      <footer className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-center md:text-left">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start">
            <Image
              src="/reallogo.jpg"
              width={130}
              height={130}
              alt="logo"
              className="rounded-lg"
            />
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <MapPin size={20} className="flex-shrink-0 text-gray-600" />
              <p className="text-gray-700">Sukhbaatariin talbain hajuuhand</p>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Phone size={20} className="flex-shrink-0 text-gray-600" />
              <p className="text-gray-700">9949 8619</p>
            </div>
            <div className="mt-2">
              <p className="font-semibold">Follow us:</p>
              <div className="flex gap-4 justify-center md:justify-start mt-2">
                <Facebook
                  size={24}
                  className="cursor-pointer hover:text-blue-600 transition"
                />
                <Twitter
                  size={24}
                  className="cursor-pointer hover:text-blue-400 transition"
                />
                <Linkedin
                  size={24}
                  className="cursor-pointer hover:text-blue-800 transition"
                />
                <Youtube
                  size={24}
                  className="cursor-pointer hover:text-red-600 transition"
                />
                <Instagram
                  size={24}
                  className="cursor-pointer hover:text-pink-600 transition"
                />
                <Rss
                  size={24}
                  className="cursor-pointer hover:text-orange-500 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <hr className="border-t my-10 w-full mx-auto border mb-8" />
        <div className=" pt-5">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-5 text-gray-700">
            <div className="flex flex-wrap gap-5 text-sm sm:text-base justify-center">
              <p className="cursor-pointer hover:underline">ABOUT US</p>
              <p className="cursor-pointer hover:underline">CONTACT US</p>
              <p className="cursor-pointer hover:underline">HELP</p>
              <p className="cursor-pointer hover:underline">PRIVACY POLICY</p>
              <p className="cursor-pointer hover:underline">DISCLAIMER</p>
            </div>
            <div className="text-gray-500 text-sm">
              Copyright © {new Date().getFullYear()} • PineShop
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
