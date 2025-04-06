import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { isAccessTokenExpired, refreshAccessToken } from "../auth/tokenService";

interface PostResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  postData: (body: any) => Promise<T | null>;
}

/**
 * Custom hook for making POST requests with auto token refresh
 * @param path - API endpoint path
 * @param options - Additional Axios request options
 */
export function usePostData<T>(
  path: string,
  options?: Omit<AxiosRequestConfig, "url" | "method" | "data">
): PostResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (body: any): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check if access token is expired and refresh if needed
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
        method: "POST",
        data: body,
        ...options,
      });

      const responseData = response.data;
      setData(responseData);
      return responseData;
    } catch (err) {
      console.error("Post error:", err);
      
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      
      // Handle different error scenarios
      if (axiosError.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        const serverErrorMessage = 
          axiosError.response?.data?.error || 
          axiosError.response?.data?.message || 
          axiosError.message || 
          "An error occurred while processing your request.";
        
        setError(serverErrorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
}

export default usePostData;