"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { Toaster, toast } from "sonner";

export default function SignupComp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    let newErrors: {
      fullName?: boolean;
      email?: boolean;
      password?: boolean;
      confirmPassword?: boolean;
    } = {};


    const fullNameRegex = /^[A-Za-z\s]+$/;
    if (!fullName.trim() || !fullNameRegex.test(fullName)) {
      newErrors.fullName = true;
    }


    if (!email.trim()) {
      newErrors.email = true;
    }


    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password.trim() || !passwordRegex.test(password)) {
      newErrors.password = true;
    }

 
    if (!confirmPassword.trim() || password !== confirmPassword) {
      newErrors.confirmPassword = true;
    }

    setErrors(newErrors);


    if (Object.keys(newErrors).length > 0) {
<<<<<<< HEAD
      toast.error("Please fill in all fields correctly, and ensure passwords are more than 6 characters long and match.");

=======

      toast.error("Please fill in all fields correctly, and ensure passwords are more than 6 characters long and match.");
>>>>>>> main
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted successfully!");
      toast.success("Form submitted successfully!");
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
      
      <TransitionLink href="/login">
        <Button className="bg-black text-white absolute top-4 right-4 rounded-2xl py-2 px-4 hover:bg-gray-900">
          Login
        </Button>
      </TransitionLink>

      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl">PineShop</h1>
        <p className="text-base md:text-lg text-gray-600">Sign up and enjoy your time.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-xs">
        <Input
          className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.fullName ? "border-red-500" : "border-transparent"}`}
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

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

        <div className="relative w-full">
          <Input
            type={showConfirmPassword ? "text" : "password"} // Conditionally render type
            className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.confirmPassword ? "border-red-500" : "border-transparent"}`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)} 
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full text-xl rounded-2xl bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800"
        >
          Sign up <ChevronRight />
        </Button>
      </form>

      <Toaster position="top-center" />
    </div>
  );
}
