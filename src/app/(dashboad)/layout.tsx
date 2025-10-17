import { DesktopSidebar } from "@/components/navigation";
import { Navbar } from "@/components/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="flex h-screen overflow-hidden">
        <DesktopSidebar />
        <div className="flex flex-col flex-1 px-6 bg-[#E5E7EB]">
          <Navbar />
          <main className="overflow-y-auto scrollbar py-2">{children}</main>
        </div>
      </div>
    </section>
  );
}
