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
} from "@/components/ui/dialog";

export default function ForgotPasswordComp() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false); // Track OTP dialog state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // OTP state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false); // Track password dialog state

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
      setIsOtpDialogOpen(true); // Open OTP dialog after email validation
    }
  };

  const handleOtpSubmit = () => {
    // Logic for validating OTP can be added here
    console.log("OTP validated!");
    setIsOtpDialogOpen(false); // Close OTP dialog
    setIsPasswordDialogOpen(true); // Open Password dialog
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
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

      {/* OTP Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Please check your email inbox</DialogTitle>
            <DialogDescription>
              We sent an OTP code to your email with 6 characters.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 mx-auto">
            <InputOTP maxLength={6}>
              <InputOTPGroup className="mx-auto">
                {otp.map((otpChar, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    onChange={(e) => handleOtpChange(index, (e.target as HTMLInputElement).value)}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button className="text-xl w-[300px] rounded-2xl mx-auto mt-5" onClick={handleOtpSubmit}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create New Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Create new password</DialogTitle>
            <DialogDescription>
              Please enter your new password and confirm it.
            </DialogDescription>
          </DialogHeader>
          <Input type="password" className="w-[80%] mx-auto rounded-2xl p-3 bg-gray-100 border-2" placeholder="Enter your new password" />
          <Input type="password" className="w-[80%] mx-auto rounded-2xl p-3 bg-gray-100 border-2" placeholder="Confirm your new password" />
          <Button className="text-xl rounded-2xl w-[70%] mx-auto mt-5">Confirm</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
