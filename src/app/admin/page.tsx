"use client";

import { useState, useEffect, useContext } from "react";
import AdminSideBar from "../_components/adminSideBar";
import AdminHome from "../_components/adminHome";
import { UserContext, UserContextType } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/constants/types";

export default function Admin() {

  const user = useContext(UserContext) as UserContextType;
  const router = useRouter();





  return (
    <div className="flex bg-black">
      <AdminSideBar />
      <AdminHome />
    </div>
  );
}
