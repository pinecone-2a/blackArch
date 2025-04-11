"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { getUserFromToken } from "./auth/tokenService";

export type UserContextType = {
  id: string;
  email: string;
  userData: string;
} | null;

export const UserContext = createContext<UserContextType>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      setIsLoading(true);
      
      // First check if we have a user in the token
      const tokenUser = getUserFromToken();
      if (tokenUser) {
        setUser({
          id: tokenUser.id,
          email: tokenUser.email,
          userData: JSON.stringify(tokenUser)
        });
        setIsLoading(false);
        return;
      }
      
      // If no token user, check localStorage as fallback
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem("userId");
        if (userId && userId !== "undefined" && userId !== "") {
          // We have a userId in localStorage, fetch the user data
          try {
            const res = await fetch("/api/user");
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }
      
      setIsLoading(false);
    };

    initUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};