import { Form } from "@/components/molecules";
import Image from "next/image";
export function Signin() {
  return (
    <section className="auth-container">
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
          <Form />
        </section>
      </section>
    </section>
  );
}
