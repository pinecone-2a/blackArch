"use client";

import { useState, useEffect, useContext } from "react";
import AdminSideBar from "../_components/adminSideBar";
import AdminHome from "../_components/adminHome";
import { UserContext, UserContextType } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/constants/types";

export default function Admin() {
    const [userData, setUserData] = useState<User | null>(null);
    const user = useContext(UserContext) as UserContextType;
  const router = useRouter();
  console.log(userData?.role);

  
  useEffect(() => {
    if (user?.userData && typeof user.userData !== 'string') {
      setUserData(user.userData as User);
    }    

  }, [user]); // Update when `user` changes


    useEffect(() => {
        if ( userData?.role == "admin") {
        console.log(userData.role)
        } else {
            router.push("/")
        }
    }, [userData]);


  return (
    <div className="flex bg-black">
      <AdminSideBar />
      <AdminHome />
    </div>
  );
}
