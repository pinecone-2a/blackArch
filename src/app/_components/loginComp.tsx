"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { Toaster, toast } from "sonner";

 
export default function LoginComp() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data) {
      console.log(data)
      alert(data.error);
    } else {
      alert("Invalid credentials");
    }
  };
  
  const [errors, setErrors] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
 
 
  const [showPassword, setShowPassword] = useState(false);
 
  const validate = () => {
    let newErrors: {
      email?: boolean;
      password?: boolean;
    } = {};
 
 
    if (!email.trim()) {
      newErrors.email = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = true;
    }
 
 
    if (!password.trim() || password.length < 6) {
      newErrors.password = true;
    }
 
    setErrors(newErrors);
 
 
    if (Object.keys(newErrors).length > 0) {
      toast.error("We couldn’t find an account matching the email and password you entered. Please check your email and password and try again.");
      return false;
    }
 
    return true;
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      handleLogin()
  
      toast.success("Login successful!");
    }
  };
 
  return (
    <div className="bg-white text-black w-full h-screen flex flex-col items-center justify-center px-4">
      <Image src="/reallogo.jpg" width={80} height={80} alt="logo" className="mb-4" />
 
      <TransitionLink href="/">
        <Button className="bg-white text-black border absolute top-4 left-4 rounded-2xl duration-200 hover:bg-gray-100">
          <ChevronLeft /> Back
        </Button>
      </TransitionLink>
 
      <TransitionLink href="/signup">
        <Button className="bg-black text-white absolute top-4 right-4 rounded-2xl py-2 px-4 hover:bg-gray-900">
          Sign up
        </Button>
      </TransitionLink>
 
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl">PineShop</h1>
        <p className="text-base md:text-lg text-gray-600">Enjoy your special time with your specials.</p>
      </div>
 
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-xs">
    
        <Input
          className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.email ? "border-red-500" : "border-transparent"}`}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
 
 
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.password ? "border-red-500" : "border-transparent"}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
 
        <TransitionLink href="/forgotpassword">
          <div className="text-sm text-gray-600 hover:underline">
            Forgot password?
          </div>
        </TransitionLink>
 
        <Button
          type="submit"
          className="w-full text-xl rounded-2xl  bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800"
        >
          Continue <ChevronRight />
        </Button>
      </form>
 
      <Toaster position="top-center" />
    </div>
  );
}
 
 
