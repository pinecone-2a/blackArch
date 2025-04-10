"use client";

import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { OrderDetails, QPayUrl } from "./types";
import { OrderDetailsSummary } from "./OrderDetails";
import { QPaySection } from "./QPaySection";
import { ProductList } from "./ProductList";

type OrderContentProps = {
  orderDetails: OrderDetails;
  orderId: string | null;
  paymentStatus: string | null;
  paymentError: string | null;
};

export const OrderContent = ({ orderDetails, orderId, paymentStatus, paymentError }: OrderContentProps) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        {/* Header section with icon */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/4 bg-black text-white p-4 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none flex items-center justify-center">
            <FaCheckCircle className="h-6 w-6 text-white" />
          </div>
          <div className="w-full sm:w-3/4 p-4 sm:p-6 flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">Таны захиалга амжилттай бүртгэгдлээ!</h1>
            <p className="text-base text-gray-800">
              Таны захиалгын дугаар: <span className="font-semibold">{orderId}</span>
            </p>
          </div>
        </div>
        
        {/* Order details and payment section */}
        <div className="p-4 sm:p-6">
          <div className="mt-4 border-t pt-4">
            <h2 className="text-lg font-semibold mb-3 text-left">Захиалгын дэлгэрэнгүй</h2>
            
            {/* Order details summary */}
            <OrderDetailsSummary orderDetails={orderDetails} />

            {/* QPay payment section - if applicable */}
            {orderDetails.paymentMethod === "qpay" && orderDetails.qpayUrl && orderDetails.paymentStatus !== "Paid" && (
              <QPaySection 
                qpayUrl={orderDetails.qpayUrl} 
                paymentStatus={paymentStatus} 
                paymentError={paymentError} 
                orderId={orderId} 
              />
            )}
            
            {/* Product list */}
            <ProductList 
              productDetails={orderDetails.productDetails} 
              totalPrice={orderDetails.totalPrice || 0} 
            />
          </div>

          {/* Footer action */}
          <div className="flex justify-center mt-6">
            <Link 
              href="/"
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors text-sm"
            >
              Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 