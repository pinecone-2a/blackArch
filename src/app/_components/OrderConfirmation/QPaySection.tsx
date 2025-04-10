"use client";

import { useState } from "react";
import { BankIcons } from "./BankIcons";
import { QPayUrl } from "./types";

type QPaySectionProps = {
  qpayUrl: QPayUrl;
  paymentStatus: string | null;
  paymentError: string | null;
  orderId: string | null;
};

export const QPaySection = ({ qpayUrl, paymentStatus, paymentError, orderId }: QPaySectionProps) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-base font-medium mb-3 text-center">QPay төлбөр хийх</h3>
      
      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center">
          {paymentError}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-2 underline hover:no-underline"
          >
            Дахин оролдох
          </button>
        </div>
      )}

      {/* QR code - desktop only */}
      <div className="hidden md:flex flex-col items-center w-full mb-4">
        <div className="mb-3 p-4 bg-white rounded-lg shadow-sm mx-auto">
          {qpayUrl?.data?.qr_image ? (
            <img 
              src={`data:image/png;base64,${qpayUrl.data.qr_image}`}
              alt="QPay QR Code"
              className="w-[220px] h-[220px] mx-auto"
              onLoad={() => console.log("QR code image loaded successfully")}
              onError={(e) => {
                console.error("Failed to load QR code image");
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="w-[220px] h-[220px] flex items-center justify-center text-sm text-gray-500 p-2 text-center">
              <p>QR код үүсгэх боломжгүй</p>
            </div>
          )}
        </div>
        <p className="text-sm text-center max-w-[300px] mb-3 mx-auto">QR кодыг Банкны аппликэйшнээр уншуулна уу</p>
        {paymentStatus === "Төлөгдсөн" && (
          <div className="opacity-0 animate-fade-in-up text-green-600 font-medium text-center">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="text-lg">Төлбөр амжилттай хийгдлээ!</p>
              <p className="text-sm text-gray-600">Таны захиалга боловсруулагдаж байна</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Bank instructions - mobile only */}
      <div className="mt-4 text-center">
        <p className="text-sm mb-3 md:hidden">Та дараах банкны аппуудаар төлбөрөө хийх боломжтой:</p>
        
        {/* Bank icons - mobile only */}
        <BankIcons qpayData={qpayUrl} />
      </div>
    </div>
  );
}; 