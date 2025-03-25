import { Github, Twitter, Linkedin, Slack } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <div className="w-full bg-black text-white py-10">
      <footer className="w-[90%] mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/blacklogo.png" width={40} height={40} alt="logo" />
              <p className="text-2xl font-bold">Transparent</p>
            </div>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Slack].map((Icon, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center w-10 h-10 rounded-md border bg-[#303030]"
                >
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 md:mt-0 bg-[#262626] border p-6 rounded-2xl max-w-[500px] w-full">
            <p className="text-sm">Sign up for our newsletter and join the Transparent community.</p>
            <div className="flex items-center gap-3 mt-4">
              <Input
                className="bg-[#1f1f1f] rounded-2xl text-white p-3 w-full"
                placeholder="Input Email Address..."
              />
              <Button className="rounded-2xl bg-white text-black hover:bg-gray-200 duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 my-6"></div>
        <div className="flex flex-col md:flex-row justify-between text-gray-400 text-sm">
          <div className="flex gap-3">
            <p>© 2025 pineshop</p>
            <p>Terms of Service</p>
            <p>Privacy & Cookies Policy</p>
          </div>
          <p className="mt-4 md:mt-0">hello@pineshop</p>
        </div>
      </footer>
    </div>
  );
}
