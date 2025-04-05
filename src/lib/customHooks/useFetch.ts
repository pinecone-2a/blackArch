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
  const [loading, setLoading] = useState<boolean>(false);
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

      // Make the API request
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
      const response = await axios({
        url: `${baseUrl}${path}`,
        method: "GET",
        ...options,
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