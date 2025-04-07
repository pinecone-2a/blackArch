"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "@/app/_components/homeHeader";
import HomeFooter from "@/app/_components/homeFooter";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1"
      >
        {children}
      </motion.div>
      <HomeFooter />
    </div>
  );
} 