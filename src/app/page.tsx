"use client";
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
