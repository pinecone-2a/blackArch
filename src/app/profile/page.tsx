"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/lib/customHooks/useProfile";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
<<<<<<< HEAD
import HomeFooter from "../_components/homeFooter";
=======
import Footer from "../_components/homeFooter";
>>>>>>> main
import Navbar from "../_components/homeHeader";

const ProfilePage = () => {
  const router = useRouter();
  const { user, orders, address, loading, error, updateAddress, refreshUserData } = useProfile();
  
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  
  const [addressUpdated, setAddressUpdated] = useState(false);

  useEffect(() => {
    if (address) {
      setAddressForm({
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || "",
      });
    }
  }, [address]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateAddress(addressForm);
    if (success) {
      setAddressUpdated(true);
      setTimeout(() => setAddressUpdated(false), 3000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
            <p className="text-gray-600 mb-6">Access your orders, addresses and account settings after logging in</p>
            <Button 
              onClick={() => router.push("/login")}
              className="w-full"
              size="lg"
            >
              Go to Login
            </Button>
          </motion.div>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 max-w-6xl mx-auto w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {user && (
            <p className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              Logged in as <span className="font-medium">{user.email}</span>
            </p>
          )}
        </div>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-6 w-full max-w-md flex justify-between">
            <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
            <TabsTrigger value="address" className="flex-1">Address</TabsTrigger>
            <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">My Orders</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshUserData}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? 
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-b-transparent border-white animate-spin"></span>
                    <span>Refreshing</span>
                  </> : 
                  "Refresh Orders"}
              </Button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20 mt-2 md:mt-0" />
                    </div>
                    <div className="border-t pt-4">
                      <Skeleton className="h-4 w-40 mb-3" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="p-6 border-red-200 bg-red-50">
                <p className="text-red-500 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshUserData}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </Card>
            ) : orders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-white rounded-lg shadow-sm"
              >
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
                <Button asChild>
                  <Link href="/category">Start Shopping</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : order.status === "pending" 
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex flex-wrap gap-x-8 gap-y-2">
                          <div className="min-w-[150px]">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-medium text-lg">${(order.totalPrice / 100).toFixed(2)}</p>
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">Shipping Address</p>
                            <p className="font-medium">
                              {order.shippingAddress?.street || "N/A"}, {order.shippingAddress?.city || "N/A"},{" "}
                              {order.shippingAddress?.state || "N/A"} {order.shippingAddress?.zip || "N/A"}
                            </p>
                          </div>
                        </div>
                        
                        {order.items && order.items.length > 0 && (
                          <div className="mt-4 flex items-center">
                            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {order.items.length} {order.items.length === 1 ? "item" : "items"}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="address">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">My Address</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshUserData}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? 
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-b-transparent border-white animate-spin"></span>
                    <span>Refreshing</span>
                  </> : 
                  "Refresh Address"}
              </Button>
            </div>
            
            <Card className="p-6 bg-white shadow-sm">
              {loading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Street", "City", "State", "ZIP"].map((field) => (
                      <div className="space-y-2" key={field}>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-28 mt-2" />
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="street" className="text-sm font-medium text-gray-700">Street Address</label>
                      <Input
                        id="street"
                        name="street"
                        value={addressForm.street}
                        onChange={handleAddressChange}
                        placeholder="Enter your street address"
                        className="h-11"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
                      <Input
                        id="city"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        placeholder="Enter your city"
                        className="h-11"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium text-gray-700">State</label>
                      <Input
                        id="state"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        placeholder="Enter your state"
                        className="h-11"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="zip" className="text-sm font-medium text-gray-700">ZIP Code</label>
                      <Input
                        id="zip"
                        name="zip"
                        value={addressForm.zip}
                        onChange={handleAddressChange}
                        placeholder="Enter your ZIP code"
                        className="h-11"
                        required
                      />
                    </div>
                  </div>
                  
                  {addressUpdated && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-50 text-green-700 rounded-md flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Address updated successfully!
                    </motion.div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full md:w-auto"
                    size="lg"
                  >
                    {loading ? 
                      <>
                        <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-b-transparent border-white animate-spin"></span>
                        Saving
                      </> : 
                      "Save Address"}
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-sm">
                <h3 className="text-lg font-medium mb-4">Personal Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/forgotpassword">
                        <span className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                          </svg>
                          Change Password
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-white shadow-sm">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/category">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                      Continue Shopping
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/cart">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      View Cart
                    </Link>
                  </Button>
                  
                  <div className="pt-4 mt-4 border-t">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Need Help?</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        Have questions about your order or account? Our customer support team is here to help.
                      </p>
                      <Button asChild className="w-full" variant="secondary">
                        <Link href="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      <HomeFooter />
    </div>
  );
};

export default ProfilePage;