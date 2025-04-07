import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserFromToken, isAccessTokenExpired, refreshAccessToken, syncUserIdToLocalStorage } from '../auth/tokenService';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

/**
 * Custom hook to get user data with auto token refresh
 */
export default function useGetUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // Check if token is expired
        if (isAccessTokenExpired()) {
          // Try to refresh the token
          const refreshSuccess = await refreshAccessToken();
          
          if (!refreshSuccess) {
            // If refresh failed, clear state and exit
            if (isMounted) {
              setUser(null);
              syncUserIdToLocalStorage(null); // Clear localStorage user ID
              setError('Session expired. Please log in again.');
              setLoading(false);
            }
            return;
          }
        }
        
        // First try to get user from token without making API call
        const tokenUser = getUserFromToken();
        
        if (tokenUser && isMounted) {
          setUser(tokenUser);
          syncUserIdToLocalStorage(tokenUser); // Ensure localStorage is in sync
          setError(null);
          setLoading(false);
          return;
        }
        
        // If not available from token, fetch from API
        const response = await axios.get('/api/user');
        
        if (isMounted) {
          setUser(response.data.user);
          syncUserIdToLocalStorage(response.data.user); // Ensure localStorage is in sync
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        if (isMounted) {
          setUser(null);
          syncUserIdToLocalStorage(null); // Clear localStorage user ID
          setError(err instanceof Error ? err.message : 'Failed to fetch user');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, loading, error };
}