"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPrompt() {
  const router = useRouter();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        <p className="text-gray-600 mb-6">Access your orders, addresses and account settings after logging in</p>
        <Button 
          onClick={() => router.push("/login")}
          className="w-full"
          size="lg"
        >
          Go to Login
        </Button>
      </motion.div>
    </div>
  );
} 