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
  updateAddress: (address: Address) => Promise<boolean>;
  refreshUserData: () => void;
}

export default function AddressForm({ address, loading, updateAddress, refreshUserData }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update form data when address data is loaded
  useEffect(() => {
    if (address) {
      setFormData({
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zip: address.zip || ''
      });
    }
  }, [address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear success/error messages when user starts typing
    setSaveSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveSuccess(false);
    setError('');

    try {
      const success = await updateAddress(formData);
      if (success) {
        setSaveSuccess(true);
        // Refresh user data to get the updated address
        refreshUserData();
      } else {
        setError('Failed to update address. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="overflow-hidden border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Хүргэлтийн хаяг</CardTitle>
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
                <span className="sr-only md:not-sr-only">Шинэчлэх</span>
              </Button>
            </div>
            <CardDescription>Хүргэлтийн хаягаа шинэчлэх</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="street" className="text-sm font-medium text-gray-700">Гудамж, байр, тоот</label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Гудамж, байр, тоотоо оруулна уу"
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-gray-700">Хот</label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Хотын нэр оруулна уу"
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium text-gray-700">Дүүрэг</label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Дүүрэг оруулна уу"
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="zip" className="text-sm font-medium text-gray-700">Шуудангийн код</label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Шуудангийн код оруулна уу"
                    className="h-10"
                    required
                  />
                </div>
              </div>
              
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-50 text-green-700 rounded-md flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Хаяг амжилттай шинэчлэгдлээ!
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 text-red-700 rounded-md flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </motion.div>
              )}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? 
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Хадгалж байна...
                    </> : 
                    <>
                      <MapPin className="h-4 w-4" />
                      Хаяг хадгалах
                    </>
                  }
                </Button>
              </div>
            </form>
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
          <CardTitle>Одоогийн хаяг</CardTitle>
          <CardDescription>Таны үндсэн хүргэлтийн хаяг</CardDescription>
        </CardHeader>
        <CardContent>
          {address ? (
            <div className="p-4 border rounded-md bg-gray-50">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Үндсэн хаяг</h4>
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
              <p className="text-gray-500">Одоогоор хаяг хадгалаагүй байна</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 