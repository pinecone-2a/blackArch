"use client";
import { Github, Twitter, Linkedin, Slack } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import mailAnimation from "./mailAnimation.json"

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Footer() {
  return (
    <div className="w-full mx-auto bg-black text-white py-16">
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
        <div className="border-t border-gray-600 my-10"></div>
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
          <p className="mt-4 md:mt-0 flex gap-1">
            hello@pineshop
            {typeof window !== 'undefined' && (
              <Lottie animationData={mailAnimation} style={{ width: 20, height: 20 }} />
            )}
            </p>
        </div>
      </div>
    </div>
  );
}
