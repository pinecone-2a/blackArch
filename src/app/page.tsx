
"use client"

import { useEffect, useState } from "react";

type ProductType = {
  name: string;
  id: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}


import Image from "next/image";
import Template from "./_components/template";
import HomePage from "./home/page";


export default function Home() {  


  return (

    <div>
      <Template>
        <HomePage />
      </Template>
    </div>

  );
}
