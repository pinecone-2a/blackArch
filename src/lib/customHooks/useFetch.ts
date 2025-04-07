import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { isAccessTokenExpired, refreshAccessToken } from "../auth/tokenService";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Helper function to get the correct API URL based on environment
 */
const getApiUrl = (path: string): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      // Use environment variable in local development
      return `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${path}`;
    } else {
      // In production, use absolute URL to API
      const origin = window.location.origin;
      return `${origin}/api/${path.replace(/^\//, '')}`;
    }
  } else {
    // Server-side rendering - use the environment variable
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${path}`;
  }
};

/**
 * Custom hook for data fetching with auto token refresh
 * @param path - API endpoint path
 * @param options - Axios request options
 * @param deps - Dependency array for refetching
 */
export function useFetchData<T>(
  path: string,
  options?: AxiosRequestConfig,
  deps: any[] = []
): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if access token is expired
      if (isAccessTokenExpired()) {
        // Try to refresh the token
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          throw new Error("Session expired. Please log in again.");
        }
      }

      // Create an absolute URL that works on all devices
      let apiUrl;
      
      // Always use absolute URL with origin for both development and production
      if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        
        // Handle the special case for admin dashboard
        if (path === '/admin') {
          apiUrl = `${origin}/api/admin`;
        } 
        // Handle API paths with or without leading slashes
        else if (path.startsWith('/api/') || path.startsWith('api/')) {
          apiUrl = `${origin}/${path.startsWith('/') ? path.slice(1) : path}`;
        } 
        // Add /api/ prefix if not present
        else {
          apiUrl = `${origin}/api/${path.replace(/^\//, '')}`;
        }
      } else {
        // Server-side rendering fallback
        apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${path}`;
      }

      console.log("Fetching from URL:", apiUrl);

      // Make the API request
      const response = await axios({
        url: apiUrl,
        method: "GET",
        ...options,
        // Add timestamp to prevent caching
        params: {
          ...(options?.params || {}),
          _t: new Date().getTime()
        }
      });

      if (response.data) {
        setData(response.data.message || response.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      
      const axiosError = err as AxiosError;
      
      if (axiosError.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError(
          axiosError.message || "An error occurred fetching the data."
        );
      }
      
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [path, options, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetchData;