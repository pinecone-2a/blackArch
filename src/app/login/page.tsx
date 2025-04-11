"use client";
import dynamic from "next/dynamic";
import Template from "../_components/template";
import { useEffect, useState } from "react";
import { getUserFromToken } from "@/lib/auth/tokenService";
import { useRouter } from "next/navigation";

const LoginComp = dynamic(() => import("../_components/loginComp"), { ssr: false });

export default function Login() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      
      // Check token first
      const user = getUserFromToken();
      if (user) {
        router.push("/");
        return;
      }
      
      // Then check localStorage as fallback
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem("userId");
        if (userId && userId !== "undefined" && userId !== "") {
          // Verify the userId is valid by making a request
          try {
            const res = await fetch("/api/user");
            if (res.ok) {
              router.push("/");
              return;
            }
          } catch (error) {
            console.error("Error verifying user:", error);
            // Clear invalid userId
            localStorage.removeItem("userId");
          }
        }
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div>
        <Template>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          </div>
        </Template>
      </div>
    );
  }

  return (
    <div>
      <Template>
        <LoginComp />
      </Template>
    </div>
  );
}
