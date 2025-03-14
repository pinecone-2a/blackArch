"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TransitionLink from "./TransitionLink";
import { Toaster, toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ForgotPasswordComp() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  const validate = () => {
    let newErrors: { email?: boolean } = {};

    if (!email.trim()) {
      newErrors.email = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Password reset email sent!");
      toast.success("Password reset instructions sent!");
      setIsDialogOpen(true); 
    }
  };

  return (
    <div className="bg-white text-black w-full h-screen flex flex-col items-center justify-center px-4">
      <Image src="/reallogo.jpg" width={80} height={80} alt="logo" className="mb-4" />

      <TransitionLink href="/login">
        <Button className="bg-white text-black border absolute top-4 left-4 rounded-2xl duration-200 hover:bg-gray-100">
          <ChevronLeft /> Back
        </Button>
      </TransitionLink>

      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl">PineShop</h1>
        <p className="text-base md:text-lg text-gray-600">Reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-xs">
        <Input
          className={`w-full rounded-2xl p-3 bg-gray-100 border-2 ${errors.email ? "border-red-500" : "border-transparent"}`}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          className="w-full text-xl rounded-2xl bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800"
        >
          Send OTP code <ChevronRight />
        </Button>
      </form>

      <Toaster position="top-center" />
      <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Please check your email indox</DialogTitle>
            <DialogDescription>
              We sent an OTP code to your email with 6 characters.
            </DialogDescription>
          </DialogHeader>
          <div className=" mt-5 mx-auto "> 
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP></div>
          <Button className="text-xl rounded-2xl 2xl:w-[70%] 2xl:mx-auto xl:w-[70%] xl:mx-auto lg:w-[70%] lg:mx-auto mt-5">Confirm</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
