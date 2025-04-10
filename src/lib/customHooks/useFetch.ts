import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { isAccessTokenExpired, refreshAccessToken } from "../auth/tokenService";

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}


const getApiUrl = (path: string): string => {
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${path}`;
    } else {
      const origin = window.location.origin;
      return `${origin}/api/${path.replace(/^\//, '')}`;
    }
  } else {
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
      // Skip token check for public routes
      const isPublicRoute = path && (
        path.includes('products/new') || 
        path.includes('products/categories') ||
        path.includes('products/featured') ||
        path.startsWith('products/') ||
        path.startsWith('/products/')
      );
      
      // Only check token expiration for non-public routes
      if (!isPublicRoute && isAccessTokenExpired()) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          // Only throw for non-public routes that require auth
          throw new Error("Session expired. Please log in again.");
        }
      }

      let apiUrl;
      
      if (!path) {
        setLoading(false);
        return;
      }
      
      if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        
        if (path === '/admin') {
          apiUrl = `${origin}/api/admin`;
        } 
        else if (path.startsWith('/api/') || path.startsWith('api/')) {
          apiUrl = `${origin}/${path.startsWith('/') ? path.slice(1) : path}`;
        } 
        else {
          apiUrl = `${origin}/api/${path.replace(/^\//, '')}`;
        }
      } else {
        apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}${path}`;
      }

      console.log("Fetching from URL:", apiUrl);

      const response = await axios({
        url: apiUrl,
        method: "GET",
        ...options,
        
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
      } else if (axiosError.response?.data) {
        // Try to extract error message from response data
        try {
          const errorData = axiosError.response.data as any;
          if (errorData.error) {
            setError(errorData.error);
          } else if (errorData.message) {
            setError(errorData.message);
          } else if (errorData.details) {
            setError(errorData.details);
          } else {
            setError(`Request failed with status code ${axiosError.response.status}`);
          }
        } catch (parseError) {
          setError(axiosError.message || "An error occurred fetching the data.");
        }
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