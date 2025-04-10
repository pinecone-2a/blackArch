"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaReceipt, FaArrowRight } from "react-icons/fa";

interface PaymentSuccessProps {
  orderId: string;
  orderDetails: {
    totalAmount: number;
    paymentMethod: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
    customerInfo?: {
      name: string;
      email: string;
    };
    shippingAddress?: {
      street: string;
      city: string;
      postalCode: string;
    };
    createdAt: string;
  };
}

export default function PaymentSuccess({ orderId, orderDetails }: PaymentSuccessProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="max-w-3xl mx-auto mt-[200px] mb-16 px-4">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden relative">
        {/* Success Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
            Захиалга баталгаажсан
          </div>
        </div>
        
        {/* Success Header */}
        <div className="bg-black p-8 text-center border-b">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
              <FaCheckCircle className="h-12 w-12 text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Төлбөр амжилттай төлөгдлөө!</h1>
          <p className="text-gray-300">Худалдан авалт хийсэнд баярлалаа. Таны захиалга амжилттай баталгаажлаа.</p>
          <p className="mt-2 text-sm bg-white inline-block px-3 py-1 rounded-full border">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        </div>
        
        {/* Order Summary */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <FaReceipt className="mr-2 text-gray-600" /> Захиалгын Дэлгэрэнгүй
            </h2>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-black hover:text-gray-600"
            >
              {showDetails ? "Hide details" : "Show details"}
            </button>
          </div>
          
          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Нийт дүн</p>
              <p className="text-xl font-bold">₮{orderDetails.totalAmount.toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Төлбөрийн Хэрэгсэл</p>
              <p className="text-lg font-medium capitalize">{orderDetails.paymentMethod}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Огноо</p>
              <p className="text-sm font-medium">{formatDate(orderDetails.createdAt)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Бүтээгдэхүүнүүд</p>
              <p className="text-lg font-medium">{orderDetails.items.length} items</p>
            </div>
          </div>
          
          {/* Detailed Order Information - Conditionally Rendered */}
          {showDetails && (
            <>
              {/* Customer Info */}
              {orderDetails.customerInfo && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2 border-b pb-2">Customer Information</h3>
                  <p className="text-sm mb-1"><span className="font-medium">Name:</span> {orderDetails.customerInfo.name}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {orderDetails.customerInfo.email}</p>
                </div>
              )}
              
              {/* Shipping Address */}
              {orderDetails.shippingAddress && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-2 border-b pb-2">Shipping Address</h3>
                  <p className="text-sm mb-1">{orderDetails.shippingAddress.street}</p>
                  <p className="text-sm">{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
                </div>
              )}
              
              {/* Items List */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 border-b pb-2">Захиалсан бүтээгдэхүүнүүд</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item) => {
                    const subtotal = item.price * item.quantity;
                    return (
                      <div key={item.id} className="flex items-center border-b border-gray-100 pb-3">
                        {item.image ? (
                          <div className="w-14 h-14 rounded overflow-hidden mr-3 flex-shrink-0 bg-gray-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded mr-3 flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                              <circle cx="9" cy="9" r="2"></circle>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-gray-800 font-medium">₮{subtotal.toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-gray-600 text-sm">Тоо ширхэг: {item.quantity}</p>
                            <p className="text-gray-500 text-sm">₮{item.price.toLocaleString()} / ширхэг</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          
          {/* Total Summary */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Нийт дүн</span>
              <span>₮{orderDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link href="/orders" className="bg-gray-100 hover:bg-gray-200 text-black py-3 px-4 rounded-lg text-center w-full sm:w-auto border border-gray-200">
            Бүх захиалгыг харах
            </Link>
            <Link href="/" className="bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-lg flex items-center justify-center w-full sm:w-auto">
              Нүүр хуудас <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
        
        {/* Additional Info */}
        {/* <div className="bg-gray-50 p-4 text-center text-sm text-gray-600 border-t">
          <p>A confirmation email has been sent to your email address.</p>
          <p className="mt-1">If you have any questions, please contact our <a href="/support" className="text-black hover:underline">customer support</a>.</p>
        </div> */}
      </div>
    </div>
  );
}