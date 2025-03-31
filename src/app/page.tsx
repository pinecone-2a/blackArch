"use client";

import { useEffect, useState } from "react";
import { UserProvider } from "@/lib/userContext";



import Image from "next/image";
import Template from "./_components/template";
import HomePage from "./home/page";

export default function Home() {
  return (
    <UserProvider>
      <div>
        <Template>
          <HomePage />
        </Template>
      </div>
    </UserProvider>
  );
}
