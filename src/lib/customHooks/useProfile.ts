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
  user?: {
    email: string;
  };
};

export const useProfile = () => {
  const userContext = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserContextType>(userContext);

  // Fetch user orders
  const fetchOrders = async () => {
    if (!userContext) return;
    
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  // Fetch user address
  const fetchAddress = async () => {
    if (!userContext) return;
    
    try {
      setLoading(true);
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
      setLoading(false);
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
      setLoading(true);
      await Promise.all([fetchOrders(), fetchAddress()]);
    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError("Failed to refresh user data");
    } finally {
      setLoading(false);
    }
  };

  // Load data when user context is available
  useEffect(() => {
    setUserData(userContext);
    
    if (userContext) {
      refreshUserData();
    } else {
      // Reset data if user is not logged in
      setOrders([]);
      setAddress(null);
      setLoading(false);
    }
  }, [userContext]);

  return {
    user: userData,
    orders,
    address,
    loading,
    error,
    updateAddress,
    refetchOrders: fetchOrders,
    refetchAddress: fetchAddress,
    refreshUserData,
  };
};