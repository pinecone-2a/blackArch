"use client";
import dynamic from "next/dynamic";
import Template from "../_components/template";

const SignUpComp = dynamic(() => import("../_components/signupComp"), { ssr: false });

export default function SignUp() {
  return (
    <div>
      <Template>
        <SignUpComp />
      </Template>
    </div>
  );
}
