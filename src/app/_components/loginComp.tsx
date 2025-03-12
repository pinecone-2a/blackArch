"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TransitionLink from "./TransitionLink"; 
import { Toaster, toast } from 'sonner'
export default function LoginComp() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="bg-white text-black w-full h-screen flex flex-col items-center justify-center px-4">
            <Toaster position="top-center"/>
            <div className="mb-4">
                <Image src="/reallogo.jpg" width={80} height={80} alt="logo" />
            </div>
            <Link href="/">
                <button className="text-black absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                    <ChevronLeft />
                </button>
            </Link>
            <TransitionLink href="/signup">
                <button className="bg-white absolute top-4 right-4 rounded-2xl text-black text-sm py-2 px-4 hover:bg-[#f2f0f1]">
                    Sign Up
                </button>
            </TransitionLink>

            <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl text-black">PineShop</h1>
                <p className="text-base md:text-lg text-gray-600">Enjoy your special time with your specials.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 w-full max-w-xs">
                <Input className="w-full rounded-2xl p-3 text-sm md:text-base bg-gray-100 text-black" placeholder="Email" />
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        className="w-full rounded-2xl p-3 text-sm md:text-base bg-gray-100 text-black"
                        placeholder="Password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-sm"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <Link href="/forgotpassword">
                    <div className="text-sm -mb-3 -mt-3 text-gray-600 hover:underline">
                        Forgot password?
                    </div>
                </Link>

                <Button className="w-full text-xl rounded-2xl bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800">
                    Continue <ChevronRight />
                </Button>
            </div>
        </div>
    );
}
