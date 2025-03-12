"use client";
import { animatePageIn } from "./animations";
import { useEffect } from "react";

import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      animatePageIn();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="transition-layout">
      {/* Banner elements */}
      <div
        id="banner-1"
        className="min-h-screen bg-black z-50 fixed top-0 left-0 w-1/4"
        style={{ display: "block" }}
      />
      <div
        id="banner-2"
        className="min-h-screen bg-black z-50 fixed top-0 left-1/4 w-1/4"
        style={{ display: "block" }}
      />
      <div
        id="banner-3"
        className="min-h-screen bg-black z-50 fixed top-0 left-2/4 w-1/4"
        style={{ display: "block" }}
      />
      <div
        id="banner-4"
        className="min-h-screen bg-black z-50 fixed top-0 left-3/4 w-1/4"
        style={{ display: "block" }}
      />
      
      {/* Main content */}
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
}