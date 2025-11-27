import { Logo } from "@/components/atoms";
import { Stepper } from "@/components/pages";
import ClientTokenWrapper from "@/components/wrappers/client-token-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to virofund!",
  description: "Congrats on get signing in, let ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <nav className="sticky top-0 z-50 flex items-center justify-center md:justify-between py-4 px-6 bg-white ">
        <Logo />
      </nav>
      <Stepper />

      <ClientTokenWrapper>
        <section className="max-w-[600px] m-auto px-6">{children}</section>
      </ClientTokenWrapper>
    </section>
  );
}
