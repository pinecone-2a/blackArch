"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupComp() {
  const router = useRouter();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      console.log(data)
      return data;
  
    } catch (error) {
      console.error("Error during registration:", error);
      return { error: "An error occurred during registration." };
    }
  };

  const validate = () => {
    let newErrors: {
      username?: boolean;
      email?: boolean;
      password?: boolean;
      confirmPassword?: boolean;
    } = {};


    const fullNameRegex = /^[A-Za-z\s]+$/;
    if (!username.trim() || !fullNameRegex.test(username)) {
      newErrors.username = true;
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

      toast.error("Please fill in all fields correctly, and ensure passwords are more than 6 characters long and match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const data = await handleRegister();
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          router.push("/login");
        }
        console.log("Form submitted successfully!");
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
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
          className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.username ? "border-red-500" : "border-transparent"}`}
          placeholder="Full Name"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          disabled={isLoading}
        />

        <Input
          className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.email ? "border-red-500" : "border-transparent"}`}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.password ? "border-red-500" : "border-transparent"}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="relative w-full">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.confirmPassword ? "border-red-500" : "border-transparent"}`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={isLoading}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full text-xl rounded-2xl bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing up...
            </>
          ) : (
            <>
              Sign up <ChevronRight />
            </>
          )}
        </Button>
      </form>

      <Toaster position="top-center" />
    </div>
  );
}