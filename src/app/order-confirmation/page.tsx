"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import Template from "@/app/_components/template";
import Navbar from "@/app/_components/homeHeader";
import useFetchData from "@/lib/customHooks/useFetch";

// Add proper TypeScript interfaces
interface QPayUrl {
  data?: {
    qr_image?: string;
    qr_text?: string;
    urls?: any[];
    [key: string]: any;
  };
  urls?: any[];
  response?: {
    data?: {
      urls?: any[];
      [key: string]: any;
    };
  };
  [key: string]: any;
}

interface OrderDetails {
  id?: string;
  totalPrice?: number;
  paymentMethod?: string;
  status?: string;
  createdAt?: string;
  qpayUrl?: QPayUrl;
  shippingAddress?: {
    city: string;
    street: string;
    [key: string]: any;
  };
  productDetails?: Array<{
    id?: string;
    name?: string;
    price?: number;
    image?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

const BankIcons = ({ qpayData }: { qpayData: QPayUrl }) => {
  const [icons, setIcons] = useState<Array<any>>([]);
  
  useEffect(() => {
   
    const defaultBanks = [
      { name: "Khan Bank", logo: "https://qpay.mn/q/logo/khan.png", link: "https://qpay.mn" },
      { name: "Golomt Bank", logo: "https://qpay.mn/q/logo/golomt.png", link: "https://qpay.mn" },
      { name: "TDB", logo: "https://qpay.mn/q/logo/tdb.png", link: "https://qpay.mn" },
      { name: "Xac Bank", logo: "https://qpay.mn/q/logo/xac.png", link: "https://qpay.mn" },
      { name: "State Bank", logo: "https://qpay.mn/q/logo/state.png", link: "https://qpay.mn" }
    ];
    
    try {
      if (qpayData?.data?.urls && Array.isArray(qpayData.data.urls) && qpayData.data.urls.length > 0) {
        setIcons(qpayData.data.urls);
      } else if (qpayData?.urls && Array.isArray(qpayData.urls)) {
        setIcons(qpayData.urls);
      } else if (qpayData?.response?.data?.urls && Array.isArray(qpayData.response.data.urls)) {
        setIcons(qpayData.response.data.urls);
      } else {
        setIcons(defaultBanks);
      }
    } catch (error) {
      setIcons(defaultBanks);
    }
  }, [qpayData]);
  
  if (!icons.length) return null;
  
  return (
    <div className="grid grid-cols-3 gap-3 mb-5 max-w-sm mx-auto md:hidden">
      {icons.slice(0, 17).map((bank, index) => (
        <div key={index} className="flex flex-col items-center">
          <a 
            href={bank.link || "https://qpay.mn"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-12 h-12 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center mb-1 hover:shadow-md transition-shadow"
          >
            <img 
              src={bank.logo || 'https://qpay.mn/img/logo.png'} 
              alt={bank.name || 'Bank'} 
              className="w-10 h-10 object-contain" 
              onError={(e) => { e.currentTarget.src = 'https://qpay.mn/img/logo.png'; }} 
              loading="eager"
            />
          </a>
          <span className="text-xs text-center line-clamp-1">{bank.name || 'Bank'}</span>
        </div>
      ))}
    </div>
  );
};

function OrderConfirmationContent({ orderId }: { orderId: string | null }) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const {data, loading, error: fetchError} = useFetchData(orderId ? `/api/order/${orderId}` : null);

  useEffect(() => {
 
    if (!orderId) {
      setError("Захиалгын дугаар олдсонгүй");
      return;
    }
    
    if (fetchError) {
      setError("Захиалгын мэдээлэл авахад алдаа гарлаа");
      return;
    }
    
    // Process data if available
    if (data) {
      // Type assertion for the data from API
      const typedData = data as OrderDetails;
      let processedData = {...typedData};
      
      // Process QPay URL if present
      if (typedData.paymentMethod === "qpay" && typedData.qpayUrl) {
        let processedQPayUrl: QPayUrl = typedData.qpayUrl;
        
        // If qpayUrl is a string, try to parse it as JSON
        if (typeof typedData.qpayUrl === 'string') {
          try {
            processedQPayUrl = JSON.parse(typedData.qpayUrl as string) as QPayUrl;
          } catch (error) {
            // If parsing fails, create a basic structure
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
      
      setOrderDetails(processedData);
      setError("");
      
      // Save to localStorage as backup
      try {
        localStorage.setItem("lastOrderDetails", JSON.stringify({
          orderId: orderId,
          orderData: processedData
        }));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  }, [orderId, data, fetchError]);

  // Try to get order details from localStorage if we have an error and orderId
  useEffect(() => {
    if ((error || !data) && orderId) {
      try {
        const lastOrderDetails = localStorage.getItem("lastOrderDetails");
        if (lastOrderDetails) {
          const parsedDetails = JSON.parse(lastOrderDetails);
          if (parsedDetails.orderId === orderId && parsedDetails.orderData) {
            setOrderDetails(parsedDetails.orderData);
            setError("");
          }
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }
    }
  }, [error, orderId, data]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-16 sm:mt-24 md:mt-32 py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !orderDetails) {
    return (
      <div className="max-w-4xl mx-auto mt-16 sm:mt-24 md:mt-32 py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="text-center text-red-600 min-h-[200px] flex flex-col justify-center">
            <p className="text-base font-medium mb-4">{error}</p>
            <Link href="/" className="text-black hover:text-gray-700 underline">
              Нүүр хуудас руу буцах
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 sm:mt-24 md:mt-32 py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        {/* Simplified top section with smaller icon */}
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

        {/* Rest of the content */}
        <div className="p-4 sm:p-6">
          {orderDetails && (
            <div className="mt-4 border-t pt-4">
              <h2 className="text-lg font-semibold mb-3 text-left">Захиалгын дэлгэрэнгүй</h2>
              <div className="text-left mb-4 text-sm sm:text-base">
                <p className="mb-2"><span className="font-medium">Нийт дүн:</span> ₮{Number(orderDetails.totalPrice || 0).toLocaleString()}</p>
                <p className="mb-2"><span className="font-medium">Төлбөрийн хэлбэр:</span> {
                  orderDetails.paymentMethod === "card" ? "Карт" : 
                  orderDetails.paymentMethod === "qpay" ? "QPay" : "Бэлэн мөнгө"
                }</p>
                {orderDetails.shippingAddress && (
                  <p className="mb-2"><span className="font-medium">Хүргэлтийн хаяг:</span> {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.street}</p>
                )}
                <p className="mb-2"><span className="font-medium">Захиалгын төлөв:</span> {
                  orderDetails.status === "pending" ? "Хүлээгдэж байна" : 
                  orderDetails.status === "processing" ? "Боловсруулж байна" : 
                  orderDetails.status === "shipped" ? "Илгээгдсэн" : 
                  orderDetails.status === "delivered" ? "Хүргэгдсэн" : orderDetails.status || "Бүртгэгдсэн"
                }</p>
                {orderDetails.createdAt && (
                  <p className="mb-2"><span className="font-medium">Огноо:</span> {new Date(orderDetails.createdAt).toLocaleString()}</p>
                )}
              </div>

              {/* QPay payment section - QR code only on PC, bank apps only on mobile */}
              {orderDetails.paymentMethod === "qpay" && orderDetails.qpayUrl && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-base font-medium mb-3 text-center">QPay төлбөр хийх</h3>
                  
                  {/* QR code - desktop only */}
                  <div className="hidden md:flex flex-col items-center w-full mb-4">
                    <div className="mb-3 p-4 bg-white rounded-lg shadow-sm mx-auto">
                      {orderDetails.qpayUrl?.data?.qr_image ? (
                        <img 
                          src={`data:image/png;base64,${orderDetails.qpayUrl.data.qr_image}`}
                          alt="QPay QR Code"
                          className="w-[220px] h-[220px] mx-auto"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-[220px] h-[220px] flex items-center justify-center text-sm text-gray-500 p-2 text-center">
                          <p>QR код үүсгэх боломжгүй</p>
                        </div>
                      )}
                      <div className="hidden w-[220px] h-[220px] flex items-center justify-center text-sm text-gray-500 p-2 text-center">
                        <p>QR код үүсгэх боломжгүй</p>
                      </div>
                    </div>
                    <p className="text-sm text-center max-w-[300px] mb-3 mx-auto">QR кодыг Банкны аппликэйшнээр уншуулна уу</p>
                  </div>
                  
                  {/* Bank instructions - mobile only */}
                  <div className="mt-4 text-center">
                    <p className="text-sm mb-3 md:hidden">Та дараах банкны аппуудаар төлбөрөө хийх боломжтой:</p>
                    
                    {/* Bank icons - mobile only */}
                    <BankIcons qpayData={orderDetails.qpayUrl} />
                  </div>
                </div>
              )}
              
              {/* Product list */}
              {orderDetails.productDetails && orderDetails.productDetails.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-base font-medium mb-3 text-left">Захиалсан бүтээгдэхүүнүүд</h3>
                  <div className="space-y-3">
                    {orderDetails.productDetails.map((product, index) => (
                      <div key={product.id || index} className="flex items-center border-b pb-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-gray-800 text-sm">₮{Number(product.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
}

function ClientWrapper() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [storedOrderId, setStoredOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      sessionStorage.setItem("currentOrderId", orderId);
      setStoredOrderId(orderId);
    } else {
      const saved = sessionStorage.getItem("currentOrderId");
      setStoredOrderId(saved);
    }
  }, [orderId]);

  return (
    <>
      <Navbar />
      <OrderConfirmationContent orderId={storedOrderId} />
    </>
  );
}





export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Уншиж байна...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}

