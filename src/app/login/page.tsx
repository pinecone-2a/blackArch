"use client";
import dynamic from "next/dynamic";
import Template from "../_components/template";

const LoginComp = dynamic(() => import("../_components/loginComp"), { ssr: false });

export default function Login() {
  return (
    <div>
      <Template>
        <LoginComp />
      </Template>
    </div>
  );
}
