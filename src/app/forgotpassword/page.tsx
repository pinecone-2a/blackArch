"use client"; 

import dynamic from "next/dynamic";
import Template from "../_components/template";

const ForgotPasswordComp = dynamic(() => import("../_components/forgotPass"), { ssr: false });

export default function ForgotPassword() {
  return (
    <div>
      <Template>
        <ForgotPasswordComp />
      </Template>
    </div>
  );
}
