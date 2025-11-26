import { DesktopSidebar } from "@/components/navigation";
import { Navbar } from "@/components/navigation";
import { TokenChecker } from "@/components/wrappers";
import { UserProfileWrapper } from "@/components/wrappers/user-profile-wrapper";
import { Providers } from "../providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TokenChecker>
      <UserProfileWrapper>
        
        <Providers>
        <section>
          <div className="flex h-screen overflow-y-auto">
            <DesktopSidebar />
            <div className="flex flex-col flex-1 px-3 md:px-6 bg-[#E5E7EB]">
              <Navbar />
              <main className="overflow-y-auto scrollbar h-full py-2">{children}</main>
            </div>
          </div>
        </section>
        </Providers>
      </UserProfileWrapper>
    </TokenChecker>
  );
}
