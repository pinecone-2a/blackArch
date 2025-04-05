"use client";
import dynamic from "next/dynamic";
import Template from "../_components/template";
import { useEffect } from "react";
import { getUserFromToken } from "@/lib/auth/tokenService";
import { useRouter } from "next/navigation";

const LoginComp = dynamic(() => import("../_components/loginComp"), { ssr: false });

export default function Login() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = getUserFromToken();
    if (user) {
      // Redirect to home page if already logged in
      router.push("/");
    }
  }, [router]);

  return (
    <div>
      <Template>
        <LoginComp />
      </Template>
    </div>
  );
}
