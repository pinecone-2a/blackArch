"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Home, Plus, CreditCard, MapPin, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QPAY from "@togtokh.dev/qpay"

interface CartItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

export default function Payment() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);


//   async function fetchQPay() {

//   const res = await fetch("/api/qpay", {
//     method: "POST",
//   });
  
//   const data = await res.json();
//   console.log(data);
// }


  




  
  // New address form state
  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "isDefault">>({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  // Delivery fee and promo code state from the cart page
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const deliveryFee = 5000;

  // Check user login status - client-side only
  useEffect(() => {
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
    console.log("User ID from localStorage:", storedUserId);
    setUserId(storedUserId);
    // Fix login detection logic - only consider null, undefined, "undefined", or empty string as not logged in
    const loggedIn = !!storedUserId && storedUserId !== "undefined" && storedUserId !== "";
    console.log("Login status determined as:", loggedIn);
    setIsLoggedIn(loggedIn);
    
    // Load cart from localStorage
    try {
      const storedCart = typeof window !== 'undefined' ? localStorage.getItem("cart") : null;
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          console.error("Stored cart is not an array:", parsedCart);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      setCart([]);
    }

    // Load addresses from localStorage
    try {
      const storedAddresses = typeof window !== 'undefined' ? localStorage.getItem("addresses") : null;
      if (storedAddresses) {
        const parsedAddresses = JSON.parse(storedAddresses);
        if (Array.isArray(parsedAddresses)) {
          setAddresses(parsedAddresses);
          
          // Set the default address as selected if it exists
          const defaultAddress = parsedAddresses.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (parsedAddresses.length > 0) {
            setSelectedAddressId(parsedAddresses[0].id);
          }
        } else {
          console.error("Stored addresses is not an array:", parsedAddresses);
          setAddresses([]);
        }
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error parsing addresses from localStorage:", error);
      setAddresses([]);
    }

    // Load promo code and discount if they exist
    try {
      const storedPromoCode = typeof window !== 'undefined' ? localStorage.getItem("promoCode") : null;
      if (storedPromoCode) {
        setPromoCode(storedPromoCode);
        setDiscount(storedPromoCode === "Pineshop" ? 0.05 : 0);
      } else {
        setPromoCode("");
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error handling promo code:", error);
      setPromoCode("");
      setDiscount(0);
    }
  }, []);

  const subtotal = Array.isArray(cart) ? cart.reduce(
    (acc, item) => acc + ((item?.price || 0) * (item?.quantity || 1)), 
    0
  ) : 0;
  
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + deliveryFee;

  const handleAddAddress = () => {
    const newAddressItem: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    const updatedAddresses = [...addresses, newAddressItem];
    setAddresses(updatedAddresses);
    setSelectedAddressId(newAddressItem.id);
    setShowAddAddress(false);
    
    // Save to localStorage - client-side only
    if (typeof window !== 'undefined') {
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    }
    
    // Reset form
    setNewAddress({
      name: "",
      phone: "",
      address: "",
      city: "",
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
    

    if (typeof window !== 'undefined') {
      localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    }
  };

  const handleSubmitOrder = async () => {

    if (!selectedAddressId) {
      alert("Хүргэлтийн хаяг сонгоно уу!");
      return;
    }

  
    if (!isLoggedIn) {
      alert("Захиалга хийхийн тулд та нэвтэрсэн байх шаардлагатай!");
      if (typeof window !== 'undefined') {
  
        // window.location.href = "/login?redirect=/cart/payment";
      }
      return;
    }

    try {
    
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      
      if (!selectedAddress) {
        throw new Error("Selected address not found");
      }

 
      const shippingAddress = {
        street: selectedAddress.address,
        city: selectedAddress.city,
        state: "Mongolia", // Default value
        zip: "00000" // Default value since not collected
      };

      // Prepare the order data
      const orderData = {
        userId,
        totalPrice: Math.round(total), // Ensure we send an integer value
        shippingAddress,
        items: cart.map(item => item.productId), // Send just the product IDs
        paymentMethod
      };

      // Send the order to the backend
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Order creation failed");
      }

      const data = await response.json();
      console.log("Order creation response:", data);
      
      // Get the order ID (either from the new format or fall back to old format)
      const orderId = data.orderId || (data.message && data.message.id);
      
      if (!orderId) {
        console.error("No order ID received from server:", data);
        // Still show success to user but provide fallback
        alert("Захиалга амжилттай хийгдлээ!");
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem("cart");
          localStorage.removeItem("promoCode");
          // Redirect to home instead since we don't have an order ID
          window.location.href = "/";
        }
        return;
      }
      
      // Show success message and clear cart
      alert("Захиалга амжилттай хийгдлээ!");
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem("cart");
        localStorage.removeItem("promoCode");
        
        // Add order details to localStorage to help with troubleshooting
        try {
          localStorage.setItem("lastOrderDetails", JSON.stringify({
            orderId,
            orderData: data.message,
            timestamp: new Date().toISOString()
          }));
        } catch (e) {
          console.error("Could not save order details to localStorage:", e);
        }
        
        // Redirect to order confirmation page with the order ID
        window.location.href = `/order-confirmation?orderId=${orderId}`;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-24">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Хүргэлт ба төлбөр
      </h2>

      {!isLoggedIn && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Анхааруулга</AlertTitle>
          <AlertDescription>
            Захиалга хийхийн тулд та нэвтэрсэн байх шаардлагатай.{" "}
            <Link href="/login?redirect=/cart/payment" className="font-bold underline">
              Энд дарж нэвтрэнэ үү
            </Link>
            <div className="mt-2 text-xs">
              {userId && <span>Системийн алдаа: Таны ID ({userId}) зөв байна, гэвч нэвтрээгүй хэмээн таних ийн байна. Дахин нэвтэрнэ үү.</span>}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Address Selection */}
        <div className="lg:w-2/3 space-y-6">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Хүргэлтийн хаяг
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Шинэ хаяг нэмэх
                </Button>
              </div>

              {addresses.length > 0 ? (
                <RadioGroup 
                  value={selectedAddressId} 
                  onValueChange={setSelectedAddressId}
                  className="space-y-4"
                >
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start rounded-lg border p-4 hover:bg-gray-50">
                      <RadioGroupItem 
                        value={address.id} 
                        id={`address-${address.id}`} 
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <Label 
                          htmlFor={`address-${address.id}`} 
                          className="flex justify-between items-start"
                        >
                          <div>
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                Үндсэн
                              </span>
                            )}
                            <p className="text-gray-600 mt-1">
                              {address.city}, {address.address}
                            </p>
                            <p className="text-gray-500 text-sm">{address.phone}</p>
                          </div>
                          {!address.isDefault && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-xs"
                            >
                              Үндсэн болгох
                            </Button>
                          )}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              ) : !showAddAddress ? (
                <div className="text-center py-8">
                  <Home className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Хаяг алга байна</h3>
                  <p className="mt-1 text-gray-500">
                    Та доорх товчийг дарж хүргэлтийн хаягаа оруулна уу.
                  </p>
                  <Button 
                    onClick={() => setShowAddAddress(true)} 
                    className="mt-4"
                  >
                    Хаяг нэмэх
                  </Button>
                </div>
              ) : null}

              {showAddAddress && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-medium mb-4">Шинэ хаяг нэмэх</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="name">Нэр</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={newAddress.name} 
                        onChange={handleInputChange} 
                        placeholder="Таны бүтэн нэр"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Утасны дугаар</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={newAddress.phone} 
                        onChange={handleInputChange} 
                        placeholder="99001122"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="city">Хот / Аймаг</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={newAddress.city} 
                      onChange={handleInputChange} 
                      placeholder="Улаанбаатар"
                      className="mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="address">Дэлгэрэнгүй хаяг</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={newAddress.address} 
                      onChange={handleInputChange} 
                      placeholder="Дүүрэг, хороо, байр, хаалганы дугаар"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddAddress(false)}
                    >
                      Цуцлах
                    </Button>
                    <Button onClick={handleAddAddress}>
                      Хадгалах
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold flex items-center mb-4">
                <CreditCard className="mr-2" size={20} />
                Төлбөрийн хэлбэр
              </h3>
              
              <RadioGroup 
                defaultValue="card" 
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <RadioGroupItem value="card" id="payment-card" />
                    <Label htmlFor="payment-card" className="ml-3 flex items-center">
                      <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6 15H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Карт
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <RadioGroupItem value="qpay" id="payment-qpay" />
                    <Label htmlFor="payment-qpay" className="ml-3 flex items-center">
                      <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      QPay
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <RadioGroupItem value="cash" id="payment-cash" />
                    <Label htmlFor="payment-cash" className="ml-3 flex items-center">
                      <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Бэлэн мөнгө
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-8">
            <Link href="/cart">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Сагс руу буцах
              </Button>
            </Link>
          </div>
        </div>

        {/* Right column - Order Summary */}
        <div className="lg:w-1/3 w-full mt-8 lg:mt-0">
          <div className="bg-white border shadow-sm p-6 rounded-xl sticky top-28">
            <h3 className="text-xl font-bold border-b pb-4 mb-4">
              Захиалгын мэдээлэл
            </h3>
            
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center py-2">
                  <div className="flex items-center">
                    <div className="bg-gray-50 rounded p-1 mr-3">
                      <img 
                        src={item.image || ''} 
                        alt={item.name || 'Product'} 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name || 'Unknown Product'}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity || 0} x ₮{(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">₮{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t my-3 pt-3"></div>
            
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between items-center">
                <span>Дүн: ({cart.length})</span>
                <span className="font-medium">₮{(subtotal || 0).toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Хөнгөлөлт ({discount * 100}%)</span>
                  <span>- ₮{(discountAmount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Хүргэлтийн төлбөр</span>
                <span className="font-medium">₮{(deliveryFee || 0).toLocaleString()}</span>
              </div>
              <div className="border-t my-3 pt-3"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Нийт төлбөр</span>
                <span>₮{(total || 0).toLocaleString()}</span>
              </div>
            </div>

            <Button 
              onClick={handleSubmitOrder}
              disabled={!selectedAddressId}
              className="w-full mt-6 py-6 bg-black hover:bg-gray-800 rounded-xl text-lg"
            >
              Захиалга баталгаажуулах
            </Button>
            
            {!selectedAddressId && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Үргэлжлүүлэхийн тулд хаяг сонгоно уу
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}