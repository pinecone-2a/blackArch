"use client";
import dynamic from "next/dynamic";
import Template from "../_components/template";
import { useEffect } from "react";
import { getUserFromToken } from "@/lib/auth/tokenService";
import { useRouter } from "next/navigation";

const SignUpComp = dynamic(() => import("../_components/signupComp"), { ssr: false });

export default function SignUp() {
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
        <SignUpComp />
      </Template>
    </div>
  );
}
