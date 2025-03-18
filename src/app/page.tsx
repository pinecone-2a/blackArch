
"use client"

import { Product } from "@prisma/client";
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
  const [data, setData] = useState<ProductType | null>(null);
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products"); 
      const data = await res.json();
      console.log(data);
      setData(data.message[0])
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  


  return (

    <div>
      <Template>
        <HomePage />
      </Template>
    </div>

  );
}
