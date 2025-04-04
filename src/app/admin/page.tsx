"use client";

import { useState, useEffect, useContext } from "react";
import AdminSideBar from "../_components/adminSideBar";
import AdminHome from "../_components/adminHome";
import { UserContext, UserContextType } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import AdminHeader from "../_components/adminHeader";
import type { User } from "@/lib/constants/types";

export default function Admin() {

  const user = useContext(UserContext) as UserContextType;
  const router = useRouter();





  return (
    <div className="flex min-h-screen bg-[#4c4c4c]">
      <AdminSideBar  />
      <div className="flex flex-col flex-1"> 
        <AdminHeader  />
        <AdminHome  />
      </div>
    </div>
  );
  
}
