"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MapPin, RefreshCcw } from "lucide-react";

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressFormProps {
  address: Address | null;
  loading: boolean;
  refreshUserData: () => void;
  updateAddress: (address: Address) => Promise<boolean>;
}

export default function AddressForm({ 
  address, 
  loading, 
  refreshUserData, 
  updateAddress 
}: AddressFormProps) {
  const [addressForm, setAddressForm] = useState<Address>({
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

  return (
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
              <AddressFormSkeleton />
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
      
      <AddressSummary address={address} />
    </div>
  );
}

function AddressFormSkeleton() {
  return (
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
  );
}

interface AddressSummaryProps {
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
}

function AddressSummary({ address }: AddressSummaryProps) {
  return (
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
  );
} 