import { useState, useEffect } from 'react';
import { useUser, UserContextType } from '@/lib/userContext';

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type Order = {
  id: string;
  status: string;
  totalPrice: number;
  items: string[];
  shippingAddress: Address;
  createdAt: string;
  paymentMethod?: string;
  paymentStatus?: string;
  user?: {
    email: string;
  };
  productDetails?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
  }>;
};

export const useProfile = () => {
  const userContext = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserContextType>(userContext);

  // Fetch user orders
  const fetchOrders = async () => {
    if (!userContext) return;
    
    try {
      setOrdersLoading(true);
      const res = await fetch('/api/user/orders');
      
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError('Error loading orders');
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch user address
  const fetchAddress = async () => {
    if (!userContext) return;
    
    try {
      setAddressLoading(true);
      const res = await fetch('/api/user/address');
      
      if (!res.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await res.json();
      setAddress(data.address);
    } catch (err) {
      setError('Error loading address');
      console.error(err);
    } finally {
      setAddressLoading(false);
    }
  };

  // Update user address
  const updateAddress = async (newAddress: Address) => {
    if (!userContext) return false;
    
    try {
      setLoading(true);
      const res = await fetch('/api/user/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update address');
      }
      
      const data = await res.json();
      setAddress(data.address);
      return true;
    } catch (err) {
      setError('Error updating address');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refresh all user data
  const refreshUserData = async () => {
    try {
      setOrdersLoading(true);
      setAddressLoading(true);
      await Promise.all([fetchOrders(), fetchAddress()]);
    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError("Failed to refresh user data");
    } finally {
      setOrdersLoading(false);
      setAddressLoading(false);
    }
  };

  // Load data when user context is available
  useEffect(() => {
    let isMounted = true;
    
    const initializeUserData = async () => {
      setUserData(userContext);
      
      if (userContext) {
        try {
          setLoading(true);
          await Promise.all([fetchOrders(), fetchAddress()]);
        } catch (error) {
          console.error("Error initializing user data:", error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        // Reset data if user is not logged in
        setOrders([]);
        setAddress(null);
        setLoading(false);
      }
    };

    initializeUserData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [userContext]);

  return {
    user: userData,
    orders,
    address,
    loading,
    ordersLoading,
    addressLoading,
    error,
    updateAddress,
    refetchOrders: fetchOrders,
    refetchAddress: fetchAddress,
    refreshUserData,
  };
};