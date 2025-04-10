"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/app/_components/homeFooter";
import Navbar from "@/app/_components/homeHeader";
import { OrderConfirmationContent } from "@/app/_components/OrderConfirmation";

function ClientWrapper() {
  const searchParams = useSearchParams();
  const [orderIdState, setOrderIdState] = useState<string | null>(null);
  const orderIdFromUrl = searchParams?.get("orderId");

  useEffect(() => {
    if (orderIdFromUrl) {
      setOrderIdState(orderIdFromUrl);
    } else if (typeof window !== 'undefined') {
      const savedOrderId = localStorage.getItem("lastOrderId");
      console.log("🔍 DEBUG - Order ID from localStorage:", savedOrderId);
      
      if (savedOrderId) {
        setOrderIdState(savedOrderId);
        const url = new URL(window.location.href);
        url.searchParams.set("orderId", savedOrderId);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [orderIdFromUrl, searchParams]);

  return <OrderConfirmationContent orderId={orderIdState} />;
}

export default function OrderConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mt-24 mb-16">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <div className="flex justify-center items-center py-24 min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            </div>
          </div>
        }>
          <ClientWrapper />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}