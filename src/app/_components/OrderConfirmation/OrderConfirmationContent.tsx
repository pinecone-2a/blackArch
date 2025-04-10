"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useFetchData from "@/lib/customHooks/useFetch";
import PaymentSuccess from "@/app/_components/PaymentSuccess";
import { OrderDetails } from "./types";
import { OrderContent } from "./OrderContent";

export const OrderConfirmationContent = ({ orderId }: { orderId: string | null }) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const {data, loading, error: fetchError} = useFetchData(orderId ? `/api/order/${orderId}` : null);

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Check localStorage first on component mount
  useEffect(() => {
    if (!orderId) {
      setInitialLoading(false);
      setError("Захиалгын дугаар олдсонгүй");
      return;
    }

    // Try to load from localStorage first
    try {
      console.log("Initial check - attempting to load from localStorage for order:", orderId);
      const lastOrderDetails = localStorage.getItem("lastOrderDetails");
      
      if (lastOrderDetails) {
        const parsedDetails = JSON.parse(lastOrderDetails);
        
        if (parsedDetails.orderId === orderId && parsedDetails.orderData) {
          // Check if data is recent (within last 24 hours)
          const isRecent = !parsedDetails.timestamp || 
            (new Date().getTime() - parsedDetails.timestamp < 24 * 60 * 60 * 1000);
          
          if (isRecent) {
            console.log("Initial load - using order details from localStorage");
            setOrderDetails(parsedDetails.orderData);
            setError("");
          }
        }
      }
    } catch (e) {
      console.error("Error reading from localStorage during initial load:", e);
    }
    
    // Done with initial loading check
    setInitialLoading(false);
  }, [orderId]);

  // Load payment status from session storage
  useEffect(() => {
    if (orderId) {
      const savedPaymentStatus = sessionStorage.getItem(`payment_status_${orderId}`);
      if (savedPaymentStatus === "Төлөгдсөн") {
        console.log("Retrieved paid status from session storage");
        setPaymentStatus("Төлөгдсөн");
      }
    }
  }, [orderId]);

  // Set up payment checking interval
  useEffect(() => {
    if (!orderDetails) return;
    
    if (orderDetails.paymentStatus === "Paid") {
      setPaymentStatus("Төлөгдсөн");
      if (orderId) {
        sessionStorage.setItem(`payment_status_${orderId}`, "Төлөгдсөн");
      }
      return; 
    }

    if (!orderDetails?.qpayUrl?.data?.invoice_id) return;

    let intervalId: NodeJS.Timeout;
    
    const checkPayment = async () => {
      try {
        console.log("Checking payment status for invoice:", orderDetails.qpayUrl.data.invoice_id);
        
        const response = await fetch(`/api/qpay/check-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            invoiceId: orderDetails.qpayUrl.data.invoice_id, 
            orderId: orderId 
          }),
        });

        if (!response.ok) {
          console.error(`Payment check API error: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          console.error("Error details:", errorText);
          setPaymentError(`Төлбөр шалгах үед алдаа гарлаа: ${response.status}`);
          return;
        }

        const data = await response.json();
        console.log("Payment check response:", data);

        if (data?.paid === true || data?.checkPayment?.success === true) {
          console.log("Payment successful!");
          setPaymentStatus("Төлөгдсөн");
          if (orderId) {
            sessionStorage.setItem(`payment_status_${orderId}`, "Төлөгдсөн");
          }
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Payment check error:", error);
        setPaymentError("Төлбөр шалгах үед алдаа гарлаа");
      }
    };

    checkPayment();
    
    intervalId = setInterval(checkPayment, 3000); 

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderDetails?.qpayUrl?.data?.invoice_id, orderId]);

  // Process API response data
  useEffect(() => {
    console.log("API data effect triggered:", { 
      orderId, 
      hasData: !!data, 
      hasError: !!fetchError,
      errorMsg: error 
    });

    if (!orderId) {
      console.log("No order ID provided");
      setError("Захиалгын дугаар олдсонгүй");
      return;
    }
    
    if (fetchError) {
      console.log("API fetch error:", fetchError);
      // Only set error if we don't already have order details
      if (!orderDetails) {
        setError("Захиалгын мэдээлэл авахад алдаа гарлаа");
      }
      return;
    }
    
    if (data) {
      console.log("Processing API response data for order:", orderId);
      
      const typedData = (data as any).message || data as OrderDetails;
      let processedData = {...typedData};
      
      console.log("Product details from API:", processedData.productDetails);
      
      if (typedData.paymentMethod === "qpay" && typedData.qpayUrl) {
        let processedQPayUrl = typedData.qpayUrl;
        
        if (typeof typedData.qpayUrl === 'string') {
          try {
            processedQPayUrl = JSON.parse(typedData.qpayUrl as string);
          } catch (error) {
            processedQPayUrl = {
              data: {
                qr_image: typedData.qpayUrl as string,
                qr_text: typedData.qpayUrl as string,
                urls: []
              }
            };
          }
        }
        
        processedData.qpayUrl = processedQPayUrl;
      }
      
      console.log("Setting order details from API data");
      setOrderDetails(processedData);
      setError("");
      
      try {
        localStorage.setItem("lastOrderDetails", JSON.stringify({
          orderId: orderId,
          orderData: processedData,
          timestamp: new Date().getTime()
        }));
        console.log("Order details saved to localStorage");
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  }, [orderId, data, fetchError]);

  // Try to load from localStorage if API fails or is still loading
  useEffect(() => {
    // Don't try to load from localStorage if we already have data from API
    // or if there's no orderId to look for
    if (orderDetails || !orderId) return;
    
    console.log("Checking localStorage fallback:", { 
      error, 
      hasData: !!data, 
      isLoading: loading 
    });
    
    if ((error || loading) && orderId) {
      try {
        console.log("Attempting to load order details from localStorage for order:", orderId);
        const lastOrderDetails = localStorage.getItem("lastOrderDetails");
        
        if (lastOrderDetails) {
          const parsedDetails = JSON.parse(lastOrderDetails);
          console.log("Found data in localStorage:", { 
            storedOrderId: parsedDetails.orderId, 
            currentOrderId: orderId,
            hasOrderData: !!parsedDetails.orderData
          });
          
          if (parsedDetails.orderId === orderId && parsedDetails.orderData) {
            // Check if data is recent (within last 24 hours)
            const isRecent = !parsedDetails.timestamp || 
              (new Date().getTime() - parsedDetails.timestamp < 24 * 60 * 60 * 1000);
            
            if (isRecent) {
              console.log("Using order details from localStorage (recent data)");
              setOrderDetails(parsedDetails.orderData);
              setError("");
            } else {
              console.log("Stored order details are too old, not using");
            }
          } else {
            console.log("Stored orderId doesn't match current orderId");
          }
        } else {
          console.log("No order details found in localStorage");
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }
    }
  }, [error, orderId, data, loading]);

  // Handle paid status - show payment success component
  if (paymentStatus === "Төлөгдсөн" || orderDetails?.paymentStatus === "Paid") {
    const formattedShippingAddress = orderDetails.shippingAddress ? {
      street: typeof orderDetails.shippingAddress.street === 'string' ? orderDetails.shippingAddress.street : "",
      city: typeof orderDetails.shippingAddress.city === 'string' ? orderDetails.shippingAddress.city : "",
      postalCode: (
        typeof orderDetails.shippingAddress.postalCode === 'string' ? orderDetails.shippingAddress.postalCode :
        typeof orderDetails.shippingAddress.zip === 'string' ? orderDetails.shippingAddress.zip : 
        "00000"
      )
    } : undefined;

    const paymentSuccessProps = {
      orderId: orderId || "",
      orderDetails: {
        totalAmount: orderDetails?.totalPrice || 0,
        paymentMethod: orderDetails?.paymentMethod || "unknown",
        items: Array.isArray(orderDetails?.productDetails) && orderDetails.productDetails.length > 0
          ? orderDetails.productDetails.map(product => ({
              id: product?.id || "",
              name: product?.name || "",
              price: product?.price || 0,
              quantity: 1,
              image: product?.image || undefined
            }))
          : [], 
        customerInfo: orderDetails?.customerInfo || {
          name: orderDetails?.customerName || "Guest",
          email: orderDetails?.customerEmail || "No email provided"
        },
        shippingAddress: formattedShippingAddress,
        createdAt: orderDetails?.createdAt || new Date().toISOString()
      }
    };
    
    return <PaymentSuccess {...paymentSuccessProps} />;
  }

  // Loading state - show when either initial loading or API loading
  if (initialLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex justify-center items-center py-24 min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !orderDetails) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="text-center text-red-600 py-24 min-h-[400px] flex flex-col justify-center">
            <p className="text-base font-medium mb-4">{error}</p>
            <Link href="/" className="text-black hover:text-gray-700 underline">
              Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal state with order details
  if (orderDetails) {
    return (
      <OrderContent 
        orderDetails={orderDetails}
        orderId={orderId}
        paymentStatus={paymentStatus}
        paymentError={paymentError}
      />
    );
  }

  // Fallback if somehow orderDetails is null but we're not in loading or error state
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="text-center py-24 min-h-[400px] flex flex-col justify-center">
          <p className="text-base font-medium mb-4">Захиалгын мэдээлэл ачаалж байна...</p>
        </div>
      </div>
    </div>
  );
}; 