"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import Template from "@/app/_components/template";
import Navbar from "@/app/_components/homeHeader";

// Create a separate component for the content that uses searchParams
function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [localOrderDetails, setLocalOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
      setError("Захиалгын дугаар олдсонгүй");
    }
    
    // Try to get order details from localStorage as fallback
    const details = getLocalStorageOrderDetails();
    setLocalOrderDetails(details);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      console.log("Fetching order details for order ID:", orderId);
      
      const response = await fetch(`/api/order/${orderId}`);
      
      console.log("Order API response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        throw new Error(errorData.error || "Захиалгын дэлгэрэнгүй мэдээлэл авахад алдаа гарлаа");
      }
      
      const data = await response.json();
      console.log("Order details received:", data.message ? "Yes" : "No");
      
      if (!data.message) {
        throw new Error("Серверээс захиалгын мэдээлэл хүлээн авах боломжгүй байна");
      }
      
      setOrderDetails(data.message);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError(error instanceof Error ? error.message : "Захиалгын дэлгэрэнгүй мэдээлэл авахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  // Add function to attempt to fetch order from localStorage if the server request fails
  const getLocalStorageOrderDetails = () => {
    try {
      const storedDetails = localStorage.getItem("lastOrderDetails");
      if (storedDetails) {
        return JSON.parse(storedDetails);
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6 md:p-10">
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 min-h-[300px] flex flex-col justify-center">
            <p className="text-lg font-medium mb-4">{error}</p>
            
            {/* Add fallback to display local order details if available */}
            {localOrderDetails && (
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md mt-4 mb-6">
                <p className="font-medium text-yellow-800 mb-2">Локал хадгалагдсан захиалгын мэдээлэл:</p>
                <p className="text-left text-sm mb-2"><span className="font-medium">Захиалгын дугаар:</span> {localOrderDetails.orderId}</p>
                {localOrderDetails.orderData && (
                  <>
                    <p className="text-left text-sm mb-2">
                      <span className="font-medium">Нийт үнэ:</span> ₮{Number(localOrderDetails.orderData.totalPrice).toLocaleString()}
                    </p>
                    <p className="text-left text-sm mb-2">
                      <span className="font-medium">Үүсгэсэн огноо:</span> {new Date(localOrderDetails.timestamp).toLocaleString()}
                    </p>
                  </>
                )}
                <p className="text-yellow-700 text-sm italic mt-2">
                  Тэмдэглэл: Энэ мэдээлэл нь таны вэб хөтчийн локал санах ойд хадгалагдсан бөгөөд серверийн хамгийн сүүлийн мэдээллийг агуулаагүй байж болно.
                </p>
              </div>
            )}
            
            <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
              Нүүр хуудас руу буцах
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FaCheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Таны захиалга амжилттай бүртгэгдлээ!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Таны захиалгын дугаар: <span className="font-semibold">{orderId}</span>
            </p>
            
            {orderDetails && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-left">Захиалгын дэлгэрэнгүй</h2>
                <div className="text-left mb-6">
                  <p className="mb-2"><span className="font-medium">Нийт дүн:</span> ₮{Number(orderDetails.totalPrice).toLocaleString()}</p>
                  <p className="mb-2"><span className="font-medium">Төлбөрийн хэлбэр:</span> {
                    orderDetails.paymentMethod === "card" 
                      ? "Карт" 
                      : orderDetails.paymentMethod === "qpay" 
                        ? "QPay" 
                        : "Бэлэн мөнгө"
                  }</p>
                  {orderDetails.shippingAddress && (
                    <p className="mb-2"><span className="font-medium">Хүргэлтийн хаяг:</span> {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.street}</p>
                  )}
                  <p className="mb-2"><span className="font-medium">Захиалгын төлөв:</span> {
                    orderDetails.status === "pending" 
                      ? "Хүлээгдэж байна" 
                      : orderDetails.status === "processing" 
                        ? "Боловсруулж байна" 
                        : orderDetails.status === "shipped" 
                          ? "Илгээгдсэн" 
                          : orderDetails.status === "delivered" 
                            ? "Хүргэгдсэн" 
                            : orderDetails.status
                  }</p>
                  {orderDetails.createdAt && (
                    <p className="mb-2"><span className="font-medium">Огноо:</span> {new Date(orderDetails.createdAt).toLocaleString()}</p>
                  )}
                </div>
                
                {/* Product list */}
                {orderDetails.productDetails && orderDetails.productDetails.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3 text-left">Захиалсан бүтээгдэхүүнүүд</h3>
                    <div className="space-y-4">
                      {orderDetails.productDetails.map((product: any) => (
                        <div key={product.id} className="flex items-center border-b pb-4">
                          <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden mr-4 flex-shrink-0">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-gray-600">₮{Number(product.price).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
              <Link 
                href="/"
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Нүүр хуудас руу буцах
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function OrderLoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6 md:p-10">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="ml-4 text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    </div>
  );
}

// Main component wrapping the content with Suspense
export default function OrderConfirmation() {
  return (
    <Template>
      <Navbar />
      <Suspense fallback={<OrderLoadingFallback />}>
        <OrderConfirmationContent />
      </Suspense>
    </Template>
  );
} 