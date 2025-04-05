"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/lib/customHooks/useProfile";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, PackageOpen, MapPin, CreditCard, Settings, User, ShoppingBag, LogOut, Edit, Calendar, RefreshCcw } from "lucide-react";
import HomeFooter from "../_components/homeFooter";
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
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

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
    setIsUpdatingAddress(true);
    const success = await updateAddress(addressForm);
    setIsUpdatingAddress(false);
    if (success) {
      setAddressUpdated(true);
      setTimeout(() => setAddressUpdated(false), 3000);
    }
  };

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(/[.-_]/);
    if (parts.length === 1) {
      return email.substring(0, 2).toUpperCase();
    }
    return parts.map(part => part.charAt(0).toUpperCase()).join("").substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarFallback className="bg-gray-700 text-white text-xl">{getInitials(user.email)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{user.email ? user.email.split('@')[0] : 'User'}</h1>
                <p className="text-gray-300 text-sm">{user.email || 'No email available'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <Badge variant="outline" className="bg-white/10 text-white border-transparent px-3 py-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                Member since {user.createdAt ? formatDate(user.createdAt) : "N/A"}
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-transparent px-3 py-1 flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" />
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="bg-white/10 border-transparent hover:bg-white/20" 
              size="sm"
              onClick={() => router.push("/forgotpassword")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                try {
                  const res = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  if (res.ok) {
                    router.push('/login');
                  }
                } catch (error) {
                  console.error('Logout failed:', error);
                }
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 -mt-6"
      >
        <Tabs defaultValue="orders" className="w-full">
          <Card className="mb-8 overflow-hidden border-0 shadow-md">
            <TabsList className="w-full justify-start p-0 h-auto bg-transparent border-b rounded-none">
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-6 py-4">
                <PackageOpen className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-6 py-4">
                <MapPin className="h-4 w-4" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-6 py-4">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>
          </Card>
          
          <TabsContent value="orders" className="space-y-6 mt-0">
            <div className="flex items-center justify-between mb-6">
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Refreshing</span>
                  </> : 
                  <>
                    <RefreshCcw className="h-4 w-4" />
                    Refresh Orders
                  </>
                }
              </Button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden border">
                    <CardHeader className="pb-0">
                      <div className="flex justify-between">
                        <div>
                          <Skeleton className="h-5 w-24 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50">
                      <Skeleton className="h-4 w-32" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="border-red-200">
                <CardContent className="pt-6">
                  <div className="text-red-500 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    {error}
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refreshUserData}
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border shadow-sm overflow-hidden"
              >
                <div className="p-12 flex flex-col items-center justify-center bg-white">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-sm">Your order history will appear here once you've made a purchase.</p>
                  <Button asChild className="gap-2">
                    <Link href="/category">
                      <ShoppingBag className="h-4 w-4" />
                      Start Shopping
                    </Link>
                  </Button>
                </div>
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
                    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border">
                      <CardHeader className="pb-0 pt-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-gray-100 border-0 text-gray-800 gap-1">
                              <PackageOpen className="h-3 w-3" /> 
                              Order #{order.id.slice(-6)}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                          <div>
                            <Badge className={`${order.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100" : order.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"} border-0`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h4>
                            <p className="text-2xl font-semibold">${(order.totalPrice / 100).toFixed(2)}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h4>
                            <p className="font-medium">
                              {order.shippingAddress?.street || "N/A"}, {order.shippingAddress?.city || "N/A"},
                              {order.shippingAddress?.state || "N/A"} {order.shippingAddress?.zip || "N/A"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                        
                      <CardFooter className="border-t bg-gray-50 py-3 px-6">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center">
                            {order.items && (
                              <span className="text-sm">
                                {order.items.length} {order.items.length === 1 ? "item" : "items"}
                              </span>
                            )}
                          </div>
                          <Button size="sm" variant="outline" className="gap-1">
                            <PackageOpen className="h-3.5 w-3.5" />
                            View Details
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="address" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="overflow-hidden border">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Shipping Address</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={refreshUserData}
                        disabled={loading}
                        className="flex items-center gap-1"
                      >
                        {loading ? 
                          <Loader2 className="h-4 w-4 animate-spin" /> : 
                          <RefreshCcw className="h-4 w-4" />
                        }
                        <span className="sr-only md:not-sr-only">Refresh</span>
                      </Button>
                    </div>
                    <CardDescription>Update your shipping information</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
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
                      </div>
                    ) : (
                      <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="street" className="text-sm font-medium text-gray-700">Street Address</label>
                            <Input
                              id="street"
                              name="street"
                              value={addressForm.street}
                              onChange={handleAddressChange}
                              placeholder="Enter your street address"
                              className="h-10"
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
                              className="h-10"
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
                              className="h-10"
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
                              className="h-10"
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
                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            disabled={isUpdatingAddress}
                            className="gap-2"
                          >
                            {isUpdatingAddress ? 
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                              </> : 
                              <>
                                <MapPin className="h-4 w-4" />
                                Save Address
                              </>
                            }
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border overflow-hidden h-full">
                  <CardHeader>
                    <CardTitle>Recently Shipped To</CardTitle>
                    <CardDescription>Your default shipping address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {address ? (
                      <div className="p-4 border rounded-md bg-gray-50">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Default Address</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.street}<br />
                              {address.city}, {address.state} {address.zip}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                        <MapPin className="h-8 w-8 text-gray-300" />
                        <p className="text-gray-500">No address saved yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border overflow-hidden">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-md bg-gray-50">
                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                            <p className="font-medium break-all">{user.email}</p>
                          </div>
                          <div className="p-4 border rounded-md bg-gray-50">
                            <p className="text-sm text-gray-500 mb-1">Member Since</p>
                            <p className="font-medium">{user.createdAt ? formatDate(user.createdAt) : "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Security</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 border rounded-md bg-gray-50">
                            <div>
                              <p className="font-medium">Password</p>
                              <p className="text-sm text-gray-500">Update your password</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push("/forgotpassword")}
                            >
                              Change Password
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 mt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Account Security</h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button variant="outline" asChild className="gap-2">
                            <Link href="/forgotpassword">
                              <Edit className="h-4 w-4" />
                              Change Password
                            </Link>
                          </Button>
                          <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border overflow-hidden h-full">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Helpful shortcuts</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Button asChild variant="outline" className="justify-start gap-2 h-10">
                        <Link href="/category">
                          <ShoppingBag className="h-4 w-4" />
                          Continue Shopping
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="justify-start gap-2 h-10">
                        <Link href="/cart">
                          <CreditCard className="h-4 w-4" />
                          View Cart
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="rounded-md bg-blue-50 border border-blue-100 p-4 mt-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        Need Help?
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Have questions about your order or account? Our customer support team is here to help.
                      </p>
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      <HomeFooter />
    </div>
  );
};

export default ProfilePage;