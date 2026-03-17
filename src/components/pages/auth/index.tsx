"use client";

import { Loader } from "@/components/atoms/loader";
import { Form } from "@/components/molecules";
import Image from "next/image";
import { useState } from "react";
export function Signin() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  return (
    <section className="auth-container">
      {isCreatingAccount && (
        <div className="flex items-center justify-center fixed  top-0 left-0 h-screen w-screen bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <section className="hidden lg:block side-img"></section>
      <section className="auth-section flex flex-col justify-center">
        <div className="flex items-center gap-2 justify-center my-8">
          <Image
            src="/svg/logo-light.svg"
            alt="co-founder"
            width={25}
            height={25}
            className="lg:hidden"
          />
          <Image
            src="/svg/logo.svg"
            alt="co-founder"
            width={25}
            height={25}
            className="hidden lg:block"
          />

          <h1 className="text-[2em]">Virofund</h1>
        </div>
        <section className="mt-auto lg:mt-0 lg:max-w-[800px] lg:min-w-[400px] w-full lg:m-auto">
          <Form
            setIsCreatingAccount={setIsCreatingAccount}
            isCreatingAccount={isCreatingAccount}
          />
        </section>
      </section>
    </section>
  );
}
