<<<<<<< HEAD
import { Github, Twitter, Linkedin, Slack } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import mailAnimation from "./mailAnimation.json"

export default function Footer() {
  return (
    <div className="w-full mx-auto bg-black text-white py-8">
      <div className="w-[90%] md:w-[80%] max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full md:w-auto flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/blacklogo.png" width={40} height={40} alt="logo" />
              <p className="text-2xl font-bold">Transparent</p>
            </div>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Slack].map((Icon, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center w-10 h-10 rounded-md border bg-[#303030] hover:bg-[#404040] transition-all duration-300"
                >
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-[500px] bg-[#262626] border p-5 md:p-6 rounded-2xl">
            <p className="text-sm text-gray-300">
              Sign up for our newsletter and join the Transparent community.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <Input
                className="bg-[#1f1f1f] rounded-2xl text-white p-3 w-full"
                placeholder="Enter your email..."
              />
              <Button className="rounded-2xl bg-white text-black hover:bg-gray-200 transition-all duration-300 w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 my-6"></div>
        <div className="flex flex-col md:flex-row justify-between text-gray-400 text-sm text-center md:text-left">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <p>© 2025 pineshop</p>
            <p className="cursor-pointer hover:text-white transition">
              Terms of Service
            </p>
            <p className="cursor-pointer hover:text-white transition">
              Privacy & Cookies Policy
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-1">
            hello@pineshop
            <Lottie animationData={mailAnimation} style={{ width: 20, height: 20 }} />
            </div>
=======
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative text-white py-6 mt-10 overflow-hidden h-96">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="footer.gif"
      ></img>

      <div className="absolute inset-0 bg-opacity-50 z-10"></div>

      <div className="relative container mx-auto px-6 flex flex-col md:flex-row justify-between items-center z-20">
        <div className="text-2xl font-bold">Pineshop</div>

        <nav className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-400">
            Нүүр
          </a>
          <a href="#" className="hover:text-gray-400">
            Бидний тухай
          </a>
          <a href="#" className="hover:text-gray-400">
            Холбоо барих
          </a>
        </nav>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-500">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="hover:text-red-500">
            <FaYoutube size={24} />
          </a>
>>>>>>> main
        </div>
      </div>

      <div className="relative text-center text-gray-300 text-sm mt-4 z-20">
        © 2025 VideoToi. Бүх эрх хуулиар хамгаалагдсан.
      </div>
    </footer>
  );
}
