import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  userData: {
    id: string;
    email: string;
    role: string;
  };
  exp: number;
}

// Get user data from access token in cookies
export const getUserFromToken = (): {
  id: string;
  email: string;
  role: string;
} | null => {
  try {
    // This only works client-side
    if (typeof document === "undefined") return null;

    // Try to extract token from cookie - this is a simplistic approach
    // In a real app, you might want to use a cookie library
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('accessToken='));
    
    if (!tokenCookie) return null;
    
    const accessToken = tokenCookie.split('=')[1];
    if (!accessToken) return null;
    
    const decoded = jwtDecode<DecodedToken>(accessToken);
    
    // Sync user ID to localStorage if available
    syncUserIdToLocalStorage(decoded.userData);
    
    return decoded.userData;
  } catch (error) {
    console.error("Error extracting user from token:", error);
    return null;
  }
};

// Sync user ID to localStorage
export const syncUserIdToLocalStorage = (userData: { id: string; email: string; role: string; } | null): void => {
  if (typeof window === 'undefined') return;
  
  if (userData && userData.id) {
    localStorage.setItem("userId", userData.id);
    console.log("Synced user ID to localStorage:", userData.id);
  } else {
    localStorage.removeItem("userId");
    console.log("Removed user ID from localStorage");
  }
};

// Check if the access token is expired or will expire soon
export const isAccessTokenExpired = (): boolean => {
  try {
    // This only works client-side
    if (typeof document === "undefined") return true;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('accessToken='));
    
    if (!tokenCookie) return true;
    
    const accessToken = tokenCookie.split('=')[1];
    if (!accessToken) return true;
    
    const decoded = jwtDecode<DecodedToken>(accessToken);
    
    // Check if token will expire in the next 30 seconds
    const currentTime = Math.floor(Date.now() / 1000);
    return !decoded.exp || currentTime > decoded.exp - 30;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

// Refresh the access token using the refresh token
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    // This endpoint will use the refreshToken cookie automatically
    const response = await axios.get('/api/auth/refresh');
    
    if (response.status === 200 && response.data.accessToken) {
      // The token is set as a cookie by the server
      // No need to manually set it here
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

// Logout function - clear tokens
export const logout = async (): Promise<boolean> => {
  try {
    await axios.post('/api/auth/logout');
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("userId");
    }
    
    window.location.href = '/login'; // Redirect to login
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};