"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TransitionLink from "./TransitionLink"; 

export default function SignupComp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-white text-black w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-4">
        <Image src="/reallogo.jpg" width={80} height={80} alt="logo" />
      </div>
      <TransitionLink href="/">
            <Button className=" bg-white text-black border absolute items-center top-4 flex left-4 rounded-2xl duration-200 hover:bg-gray-100">
        <ChevronLeft/>  Back 
        </Button>
            </TransitionLink>
      <TransitionLink href="/login">
        <button className="bg-black absolute top-4 right-4 rounded-2xl text-white text-sm py-2 px-4 hover:bg-gray-900">
          Login
        </button>
      </TransitionLink>

      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl text-black">PineShop</h1>
        <p className="text-base md:text-lg text-gray-600">
          Sign up and enjoy your time.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-xs">
        <Input
          className="w-full rounded-2xl p-3 text-sm md:text-base bg-gray-100 text-black"
          placeholder="Full Name"
        />
        <Input
          className="w-full rounded-2xl p-3 text-sm md:text-base bg-gray-100 text-black"
          placeholder="Email"
        />

        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-2xl p-3 text-sm md:text-base bg-gray-100 text-black"
            placeholder="Password"
          />
        </div>

        <div className="relative w-full">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full rounded-2xl p-3 text-sm md:text-base bg-gray-100 text-black"
            placeholder="Confirm Password"
          />
        </div>

        <Button className="w-full text-xl rounded-2xl bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800">
          Sign up <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
